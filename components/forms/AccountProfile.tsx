"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userValidation } from "@/lib/validations/user";
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,FormDescription,} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import Image from 'next/image';
import * as z from "zod";
import { ChangeEvent, useState } from "react";
import { Textarea } from "../ui/textarea";
import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";

type ClientUploadedFileDataWithUrl = ClientUploadedFileData<{ uploadedBy: string }> & {
  fileUrl: string;
};

interface Props {
    user:{
        id: string;
        name:string;
        username:string;
        objectId:string;
        bio:string;
        image:string;
    };
    btnTitle: string;
}

const AccountProfile =({user,btnTitle}: Props)=>{

  const [files, setFiles] = useState<File[]>([]);
  const {startUpload} = useUploadThing("media");

  const handleImage = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value:string)=>void) => {
    e.preventDefault();
    const fileReader = new FileReader();
  
    if (e.target.files && e.target.files.length > 0 ){
      const file = e.target.files[0];
      setFiles(Array.from(e.target.files));
  
      if(!file.type.includes("image")) return;
  
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);}

      fileReader.readAsDataURL(file);
    }
  }

  const form = useForm({
        resolver: zodResolver(userValidation),
        defaultValues:{
            profile_photo : user?.image|| "" ,
            name: user?.name|| "",
            username: user?.username|| "",
            bio: user?.bio|| ""
        }
  })

  const onSubmit = async (values: z.infer<typeof userValidation>) => {
    const blob = values.profile_photo;
    const hasImageChanged = isBase64Image(blob);

    if(hasImageChanged){
      const imgRes = await startUpload(files) as ClientUploadedFileDataWithUrl[];
      if(imgRes && imgRes[0].fileUrl){
        values.profile_photo = imgRes[0].fileUrl;
      }
    }

    //TODO: update user profile
  }
    
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} 
      className="flex flex-col justify-start gap-1">

        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-4">
              <FormLabel className="account-form_image-label">
                {field.value ? 
                  (<Image src={field.value} alt="profile icon" width={96} height={96} priority className="rounded-full object-contain"/>)
                : (<Image src="/assets/profile.svg" alt="profile icon" width={24} height={24} className="object-contain"/>)}
              </FormLabel>
              <FormControl className="flex-1 text-base-semibold text-gray-200">
                <Input type="file" accept="image/*" placeholder="upload the photo" className="account-form_image-input" onChange={(e)=>handleImage(e,field.onChange)}/>
              </FormControl>
            </FormItem>)}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className=" text-base-semibold text-light-1">
                Name
              </FormLabel>
              <FormControl>
                <Input type="text" className="account-form_input no-focus" {...field}/>
              </FormControl>
            </FormItem>)}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className=" text-base-semibold text-light-1">
                Username
              </FormLabel>
              <FormControl>
                <Input type="text" className="account-form_input no-focus" {...field}/>
              </FormControl>
            </FormItem>)}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem className="flex flex-col w-full gap-3">
              <FormLabel className="text-base-semibold text-light-1">
                Bio
              </FormLabel>
              <FormControl>
                <Textarea rows={10} className="account-form_input no-focus" {...field}/>
              </FormControl>
            </FormItem>)}
        />
        
        <Button type="submit">Submit</Button>
      </form>
    </Form>
    )
}

export default AccountProfile;