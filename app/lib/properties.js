import { db } from '../firebase/config';
import { collection, addDoc, query, where, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';
import { supabase } from '../supabase/config';
import { v4 as uuidv4 } from 'uuid';
import { getOptimizedImageUrl } from './imageUtils';

export const createProperty = async (propertyData, images, licenseImages) => {
  try {
    const propertyId = uuidv4();
    
    // Upload property images to Supabase
    const imageUrls = await Promise.all(
      images.map(async (file) => {
        const fileName = `${propertyId}/${uuidv4()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('properties')
          .upload(fileName, file);
          
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(fileName);
          
        return getOptimizedImageUrl(publicUrl);
      })
    );

    // Upload license images to Supabase
    const licenseImageUrls = await Promise.all(
      licenseImages.map(async (file) => {
        const fileName = `${propertyId}/licenses/${uuidv4()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('properties')
          .upload(fileName, file);
          
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(fileName);
          
        return getOptimizedImageUrl(publicUrl);
      })
    );

    // Create property document in Firestore
    const propertyDoc = await addDoc(collection(db, 'properties'), {
      id: propertyId,
      ...propertyData,
      images: imageUrls,
      licenseImages: licenseImageUrls,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    return { success: true, propertyId, error: null };
  } catch (error) {
    console.error('Error creating property:', error);
    return { success: false, propertyId: null, error: error.message };
  }
};

export const getPropertiesByLandlord = async (landlordId) => {
  try {
    console.log('Fetching properties for landlord:', landlordId);
    const propertiesRef = collection(db, 'properties');
    const q = query(propertiesRef, where('landlordId', '==', landlordId));
    const querySnapshot = await getDocs(q);
    
    const properties = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log('Found property:', data);
      properties.push(data);
    });
    
    console.log('Total properties found:', properties.length);
    return { properties, error: null };
  } catch (error) {
    console.error('Error getting properties:', error);
    return { properties: [], error: error.message };
  }
};
export const getAllProperties = async () => {
  try {
    const propertiesRef = collection(db, 'properties');
    const querySnapshot = await getDocs(propertiesRef);

    const properties = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return properties;
  } catch (error) {
    console.error('Error fetching all properties:', error);
    return [];
  }
};

export const getPropertyById = async (propertyId) => {
  try {
    const propertyRef = collection(db, 'properties');
    const q = query(propertyRef, where('id', '==', propertyId));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { property: null, error: 'Property not found' };
    }

    const propertyDoc = querySnapshot.docs[0];
    const propertyData = propertyDoc.data();

    return { property: propertyData, error: null };
  } catch (error) {
    console.error('Error fetching property:', error);
    return { property: null, error: error.message };
  }
};

// Function to save a property
export const saveProperty = async (userId, propertyId) => {
  try {
    const savedRef = collection(db, 'saved_properties');
    await addDoc(savedRef, {
      userId,
      propertyId,
      savedAt: new Date().toISOString()
    });
    return { success: true, error: null };
  } catch (error) {
    console.error('Error saving property:', error);
    return { success: false, error: error.message };
  }
};

// Function to unsave a property
export const unsaveProperty = async (userId, propertyId) => {
  try {
    const savedRef = collection(db, 'saved_properties');
    const q = query(savedRef, 
      where('userId', '==', userId),
      where('propertyId', '==', propertyId)
    );
    const querySnapshot = await getDocs(q);
    
    const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
    await Promise.all(deletePromises);
    
    return { success: true, error: null };
  } catch (error) {
    console.error('Error unsaving property:', error);
    return { success: false, error: error.message };
  }
};

// Function to check if a property is saved
export const isPropertySaved = async (userId, propertyId) => {
  try {
    const savedRef = collection(db, 'saved_properties');
    const q = query(savedRef,
      where('userId', '==', userId),
      where('propertyId', '==', propertyId)
    );
    const querySnapshot = await getDocs(q);
    return { isSaved: !querySnapshot.empty, error: null };
  } catch (error) {
    console.error('Error checking saved status:', error);
    return { isSaved: false, error: error.message };
  }
};

// Function to get all saved properties for a user
export const getSavedProperties = async (userId) => {
  try {
    const savedRef = collection(db, 'saved_properties');
    const q = query(savedRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    
    const savedIds = querySnapshot.docs.map(doc => doc.data().propertyId);
    
    // Get all saved properties
    const properties = [];
    for (const propertyId of savedIds) {
      const { property } = await getPropertyById(propertyId);
      if (property) {
        properties.push(property);
      }
    }
    
    return { properties, error: null };
  } catch (error) {
    console.error('Error getting saved properties:', error);
    return { properties: [], error: error.message };
  }
};

export const deleteProperty = async (propertyId) => {
  try {
    // Delete the property document from Firestore
    const propertyRef = collection(db, 'properties');
    const q = query(propertyRef, where('id', '==', propertyId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Property not found');
    }

    const propertyDoc = querySnapshot.docs[0];
    await deleteDoc(propertyDoc.ref);

    // Delete images from Supabase storage
    const { data: files, error: listError } = await supabase.storage
      .from('properties')
      .list(propertyId);

    if (!listError && files.length > 0) {
      const filePaths = files.map(file => `${propertyId}/${file.name}`);
      const { error: deleteError } = await supabase.storage
        .from('properties')
        .remove(filePaths);

      if (deleteError) throw deleteError;
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Error deleting property:', error);
    return { success: false, error: error.message };
  }
};

export const updateProperty = async (propertyId, propertyData, newImages = [], newLicenseImages = [], removedImages = [], removedLicenseImages = []) => {
  try {
    // Get the property document
    const propertyRef = collection(db, 'properties');
    const q = query(propertyRef, where('id', '==', propertyId));
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      throw new Error('Property not found');
    }

    const propertyDoc = querySnapshot.docs[0];
    const currentData = propertyDoc.data();

    // Delete removed images from storage
    const allRemovedImages = [...removedImages, ...removedLicenseImages];
    if (allRemovedImages.length > 0) {
      for (const imageUrl of allRemovedImages) {
        const path = imageUrl.split('/').pop(); // Get the filename from URL
        const { error: deleteError } = await supabase.storage
          .from('properties')
          .remove([`${propertyId}/${path}`]);

        if (deleteError) throw deleteError;
      }
    }

    // Upload new images
    const newImageUrls = await Promise.all(
      newImages.map(async (file) => {
        const fileName = `${propertyId}/${uuidv4()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('properties')
          .upload(fileName, file);
          
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(fileName);
          
        return getOptimizedImageUrl(publicUrl);
      })
    );

    // Upload new license images
    const newLicenseImageUrls = await Promise.all(
      newLicenseImages.map(async (file) => {
        const fileName = `${propertyId}/licenses/${uuidv4()}-${file.name}`;
        const { data, error } = await supabase.storage
          .from('properties')
          .upload(fileName, file);
          
        if (error) throw error;
        
        const { data: { publicUrl } } = supabase.storage
          .from('properties')
          .getPublicUrl(fileName);
          
        return getOptimizedImageUrl(publicUrl);
      })
    );

    // Update images arrays
    const updatedImages = [
      ...currentData.images.filter(url => !removedImages.includes(url)),
      ...newImageUrls
    ];

    const updatedLicenseImages = [
      ...currentData.licenseImages.filter(url => !removedLicenseImages.includes(url)),
      ...newLicenseImageUrls
    ];

    // Update property document
    await updateDoc(propertyDoc.ref, {
      ...propertyData,
      images: updatedImages,
      licenseImages: updatedLicenseImages,
      updatedAt: new Date().toISOString()
    });

    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating property:', error);
    return { success: false, error: error.message };
  }
};
