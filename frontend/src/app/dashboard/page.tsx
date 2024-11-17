"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Trash2, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Description } from "@radix-ui/react-dialog";
interface IProduct {
  _id?: string;
  title: string;
  description: string;
  tag: string[];
  image: string[];
}
const Dashboard = () => {
  const [products, setProducts] = useState<IProduct[]>([
    {
      _id: "temp",
      title: "Lorem, ipsum dolor",
      description: "Start adding your product, it will show up here",
      tag: ["car", "speed"],
      image: ["/car1.svg"],
    },
  ]);
  const router = useRouter();
  const [token, setToken] = useState<string | null>();

  const [isSearchTermCleared, setIsSearchTermCleared] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<string[] | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<IProduct>({
    _id: "",
    title: "",
    description: "",
    tag: [],
    image: [],
  });
  const [file, setFile] = useState([]);
  const [newProduct, setNewProduct] = useState<IProduct>({
    title: "",
    description: "",
    tag: [],
    image: [],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      setToken(localStorage.getItem("token"));

      try {
        const response = await fetch(
          "https://car-management-server-amber.vercel.app/api/fetch",
          {
            method: "POST",
            headers: {
              "CONTENT-TYPE": "application/json",
            },
            body: JSON.stringify({ token: localStorage.getItem("token") }),
          }
        );
        const data2 = await response.json();
        if (data2.statusCode === 200) {
          setProducts(data2.data.product);

          console.log(products);

          toast({
            title: "Message",
            description: "Product Fetched",
          });
          //   window.location.reload();
        } else if (data2.message === "jwt expired") {
          localStorage.removeItem("token");
        } else {
          throw new Error(JSON.stringify(data2));
          toast({
            title: "Message",
            description: data2.message,
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.log(error);
      }
    };
    const tokenLocalStorage = localStorage.getItem("token");
    if (tokenLocalStorage) fetchProduct();
    else router.replace("/");
  }, [isSearchTermCleared]);

  const handleImageChange = (e: any) => {
    if (e.target.files) {
      setFile(e.target.files);
      console.log(e.target.files[0]);
      const filesArray = Array.from(e.target.files).map(
        (file: any) => file.name
      );
      setSelectedFiles(filesArray);
    }
  };

  const handleAddProduct = async () => {
    const formData = new FormData();
    formData.append("token", token as string);
    formData.append("title", newProduct.title);
    formData.append("description", newProduct.description);
    // formData.append('tag',newProduct.tag)
    Array.from(newProduct.tag).forEach((tag, index) => {
      formData.append(`tag`, tag);
    });
    formData.append("image", file as any);
    Array.from(file).forEach((file, index) => {
      formData.append(`image`, file);
    });

    try {
      setIsUploading(true);
      const response = await fetch(
        "https://car-management-server-amber.vercel.app/api/upload",
        {
          method: "POST",
          // headers:{
          //     "CONTENT-TYPE":"application/json"
          // },
          body: formData,
        }
      );
      const data2 = await response.json();
      if (data2.statusCode === 201) {
        setProducts((prev) => [...(prev || []), data2.data]);

        // setProducts((prev) => {
        //     if (prev.length === 1 && prev[0]._id === "temp") {
        //
        //       return [data2.data.product];
        //     }
        //
        //     return [...prev, data2.data.product];
        //   });

        console.log(products);

        setNewProduct({ title: "", description: "", tag: [], image: [] });
        setIsAddDialogOpen(false);
        toast({
          title: "Message",
          description: "Product Addedd",
        });
      } else {
        toast({
          title: "Message",
          description: data2.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditProduct = async () => {
    try {
      setIsEditing(true);
      const response = await fetch(
        "https://car-management-server-amber.vercel.app/api/update",
        {
          method: "POST",
          headers: {
            "CONTENT-TYPE": "application/json",
          },
          body: JSON.stringify({
            data: {
              productData: {
                ...selectedProduct,
              },
            },
            token,
          }),
        }
      );
      const data2 = await response.json();
      if (data2.statusCode === 200) {
        setProducts((prev) => {
          if (!prev) return [];
          return prev.map((product) =>
            product._id === selectedProduct?._id ? selectedProduct : product
          );
        });

        toast({
          title: "Message",
          description: "Edit Successfully",
        });
      } else {
        toast({
          title: "Message",
          description: data2.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsEditing(false);
      setIsEditDialogOpen(false);
      setSelectedProduct({
        _id: "",
        title: "",
        description: "",
        tag: [],
        image: [],
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(
        "https://car-management-server-amber.vercel.app/api/delete",
        {
          method: "POST",
          headers: {
            "CONTENT-TYPE": "application/json",
          },
          body: JSON.stringify({
            data: {
              productData: {
                _id: id,
              },
            },
            token,
          }),
        }
      );
      const data2 = await response.json();
      if (data2.statusCode === 200) {
        setProducts((prev) => prev.filter((product) => product._id !== id));

        toast({
          title: "Message",
          description: data2.message,
        });
      } else {
        toast({
          title: "Message",
          description: data2.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsDeleting(false);
    }
  };
  const handleSearch = () => {
    const filteredProducts = products.filter((product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setProducts(filteredProducts);

    console.log(filteredProducts, searchTerm);
  };
  const handleSearchClear = () => {};

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">My Products</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Product</DialogTitle>
                <DialogDescription>
                  Fill in the details of your new product
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newProduct.title}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="tag">Tag</Label>
                  <Input
                    id="tag"
                    value={newProduct.tag}
                    onChange={(e) =>
                      setNewProduct((prev) => ({
                        ...prev,
                        tag: e.target.value.split(",").map((tag) => tag.trim()),
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="image">{`Image (Max 10 images)`}</Label>
                  <Input
                    placeholder="Max 10 images"
                    id="image"
                    type="file"
                    accept="image/*"
                    name="image"
                    multiple
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              <DialogFooter>
                {isUploading ? (
                  <Button onClick={handleAddProduct} disabled>
                    <Loader2 className=" animate-spin" /> Adding
                  </Button>
                ) : (
                  <Button onClick={handleAddProduct}>Add Product</Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mb-6  sm:flex gap-4">
          <Input
            className=" sm:w-full"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="border rounded px-3 py-2 mt-2 md:mt-0"
          >
            <option value="">All Tags</option>
            {/* Add your tags here */}
          </select>
          <Button onClick={handleSearch} className=" mt-2 ml-4 md:m-0 md:ml-0">
            Apply
          </Button>
          <Button
          className="mt-2 ml-4 md:mt-0 md:ml-0"
            onClick={() => {
              setIsSearchTermCleared((prev) => !prev);
              setSearchTerm("");
            }}
            disabled={searchTerm.length ? false : true}
          >
            Clear
          </Button>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {}
          {products?.map((product) => (
            <Card key={product._id}>
              <div
                className="relative h-48 w-full hover:cursor-pointer"
                onClick={() =>
                  router.push(`/productView?productId=${product._id}`)
                }
              >
                <Image
                  src={product.image[0]}
                  alt={product.title}
                  fill
                  className="object-cover rounded-t-lg"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{product.title}</CardTitle>
                    <CardDescription>
                      {product.tag?.map((tag, i) => (
                        <span key={i}>{tag} </span>
                      ))}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedProduct(product);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        handleDeleteProduct(product._id ? product._id : "")
                      }
                      disabled={isDeleting}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">{product.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
              <DialogDescription>
                Update the details of your product
              </DialogDescription>
            </DialogHeader>
            {selectedProduct && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={selectedProduct.title}
                    onChange={(e) =>
                      setSelectedProduct((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description</Label>
                  <Textarea
                    id="edit-description"
                    value={selectedProduct.description}
                    onChange={(e) =>
                      setSelectedProduct((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="edit-tag">Tag</Label>
                  <Input
                    id="edit-tag"
                    value={selectedProduct.tag}
                    onChange={(e) =>
                      setSelectedProduct((prev) => ({
                        ...prev,
                        tag: e.target.value.split(",").map((tag) => tag.trim()),
                      }))
                    }
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              {isEditing ? (
                <Button onClick={handleAddProduct} disabled>
                  <Loader2 className=" animate-spin" /> Saving
                </Button>
              ) : (
                <Button onClick={handleEditProduct}>Save Changes</Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
