"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Suspense } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter , useSearchParams} from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
interface IProduct{
  _id?:string ;
  title:string;
  description:string;
  tag:string[];
  image:string[];
}
const ProductView = () => {
  const [products, setProducts] = useState<IProduct >(
    {
        _id: "",
        title: "",
        description: "",
        tag: [],
        image: [],
      },
  );
  const searchParams = useSearchParams();
  const router = useRouter();
  useEffect(()=>{
    console.log(searchParams.get('productId'));
    const productId = searchParams.get('productId')
    if(!productId){
      toast({
        title:'Message',
        description:"Product id not provided",
        variant:"destructive"
      })
      return ;
    }
    if(!localStorage.getItem('token')){
      toast({
        title:'Message',
        description:"User no logged in",
        variant:"destructive"
      })
      return ;
    }

    const handleFetchOne = async()=>{
      try {
        const response = await fetch('https://car-management-server-amber.vercel.app/api/fetchOne',{
            method:"POST",
            headers:{
                "CONTENT-TYPE":"application/json"
            },
            body:JSON.stringify({
              data:{
                  productData:{
                      _id:productId
                  }
              },
              token:localStorage.getItem('token')
          })
            
          })
          const data2 = await response.json();
          if(data2.statusCode===200){
            setProducts({
              title:data2.data.title,
              description:data2.data.description,
              tag:data2.data.tag,
              image:data2.data.image
            })
        
            console.log(products);
            
            toast({
                title: "Message",
                description: "Product Fetched",
              })
          }else if(data2.message==='jwt expired'){
            localStorage.removeItem('token')
            
          }
          else{
            throw new Error(JSON.stringify(data2))
            toast({
                title: "Message",
                description: data2.message,
                variant:"destructive"
              })
          }
    } catch (error:any) {
        console.log(error);
    }
    }
    handleFetchOne();
  },[])



  return (
    <div className="min-h-screen bg-gray-50 py-6">
      
      <div className="max-w-7xl mx-auto px-4">
      <div className="flex justify-between mb-3">
        <h1 className=" text-3xl font-bold">Product Details</h1>
      <Button onClick={()=>router.replace('/dashboard')}>Dashboard</Button>
      </div>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Image Carousel */}
          <div className="order-2 md:order-1">
            <Card className="border-0 shadow-none">
              <CardContent className="p-0">
                <Carousel className="w-full max-w-xl mx-auto">
                  <CarouselContent>
                    {products?.image.map((image, index) => (
                      <CarouselItem key={index}>
                        <div className="relative aspect-video overflow-hidden rounded-lg">
                          <Image
                            src={image}
                            alt={`${products.title} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                            priority={index === 0}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" />
                  <CarouselNext className="right-2" />
                </Carousel>

                {/* Thumbnail Navigation */}
                <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                  {products?.image.map((image, index) => (
                    <div
                      key={index}
                      className="relative w-20 h-20 flex-shrink-0 rounded-md overflow-hidden cursor-pointer border-2 border-transparent hover:border-primary transition-colors"
                    >
                      <Image
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Product Information */}
          <div className="order-1 md:order-2">
            <Card className="border-0 shadow-none">
              <CardHeader>
                <div className="space-y-2">
                  
                    {
                    products.tag.map((tag,index)=>(
                    <Badge variant="secondary" className="w-fit mr-2" key={index}>
                      <p >{tag}<span>&nbsp;</span></p>
                    </Badge>
                    )
                    )
                    }
                    
                    
                  
                  <CardTitle className="text-3xl">{products.title}</CardTitle>
                  
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description */}
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {products.description}
                  </p>
                </div>

                

                
                
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
// export const dynamic = "force-dynamic";

// export default ProductView;
export default function Searchbar() {
  return (
    // You could have a loading skeleton as the `fallback` too
    <Suspense>
      <ProductView />
    </Suspense>
  )
}