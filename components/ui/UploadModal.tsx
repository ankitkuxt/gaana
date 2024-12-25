"use client";

import React, { useState } from 'react';
import { FieldValues, set, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from 'axios';
import useUploadModal from '@/hooks/useUploadModal';
import Modal from './Modal';
import Input from './Input';
import Button from './Button';
import { useUser } from '@/hooks/useUser';
import uniqid from "uniqid";
import { useSupabaseClient } from '@supabase/auth-helpers-react';


const UploadModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const uploadModal = useUploadModal();
  const router = useRouter();
  const { user } = useUser();
  const supabaseClient = useSupabaseClient();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      title: '',
      music: null,
      image: null,
      price: 0.0
    }
  });

  const onChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  }

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);
      const imageFile = values.image?.[0];
      const songFile = values.music?.[0];

      if (!imageFile || !songFile) {
        toast.error('Missing fields')
        return;
      }
      const uniqueID = uniqid();

      const {
        data: songData,
        error: songError,
      } = await supabaseClient
                .storage
                .from('songs')
                .upload(`song-${values.title}-${uniqueID}`, songFile, {
                  cacheControl: '3600',
                  upsert: false
                });
        if(songError){
          setIsLoading(false);
          return toast.error('Failed song upload');
        }

        const {
          data: imageData,
          error: imageError,
        } = await supabaseClient
            .storage
            .from('images')
            .upload(`image-${values.title}-${uniqueID}`, imageFile, {
              cacheControl: '3600',
              upsert: false
            });
          
            if(imageError){
              setIsLoading(false);
              return toast.error('Failed image upload');
            }

            const {
              error: supabaseError
            } = await supabaseClient
                .from('songs')
                .insert({
                  user_id: user.id,
                  title: values.title,
                  author: values.author,
                  image_path: imageData.path,
                  song_path: songData.path
                });

              if(supabaseError){
                setIsLoading(false);
                return toast.error(supabaseError.message);
              }

              router.refresh();
              setIsLoading(false);
              toast.success('Song created!')
              reset();
              uploadModal.onClose();


    } catch (error) {
      console.log("error:",error)
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Modal
      title="Add a song"
      description="Upload an mp3 file"
      isOpen={uploadModal.isOpen}
      onChange={onChange}
    >
      Upload Content
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex flex-col gap-y-4"
      >
        <Input
          id="Title"
          disabled={isLoading}
          {...register('title', { required: true })}
          placeholder="Song title"
        />

        <Input
          id='author'
          disabled={isLoading}
          {...register('author', {required: true})}
          placeholder='Song Author'
        />
        
        <div>
          <div className="pb-1">
            Select a song file
          </div>
          <Input
            placeholder="music.mp3" 
            disabled={isLoading}
            type="file"
            accept=".mp3"
            id="music"
            {...register('music', { required: true })}
          />
        </div>

        <div>
          <div className="pb-1">
            Select an image
          </div>
          <Input
            placeholder="image.jpg" 
            disabled={isLoading}
            type="file"
            accept="image/*"
            id="image"
            {...register('image', { required: true })}
          />
        </div>

        <div>
          <div className="pb-1">
            Price
          </div>
          <Input
            placeholder="1 ETH" 
            disabled={isLoading}
            type="number"
            step="any"
            id="price"
            {...register('price', { required: true })}
          />
        </div>
        <Button disabled={isLoading} type="submit">
          {isLoading ? 'Uploading...' : 'Create'}
        </Button>
      </form>
    </Modal>
  );
}

export default UploadModal;