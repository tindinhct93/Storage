import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/react";
import { SupplierAPI } from "../../services/supplier-api";
const useUpload = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const [uploadedImage, setUploadedImage] = useState(null);

  const toast = useToast();

  const handleChangeImage = (e) => {
    setImage(e.target.files[0]);
  };

  const handleUploadImage = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", image);
      const res = await SupplierAPI.createSupplier(formData);
      if (res.data.data) {
        console.log(res.data);
        setUploadedImage(res.data.data);
        toast({
          title: "Image Uploaded",
          description: res.data.message,
          status: "success",
          duration: 4000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log(error);
      alert(error);
      toast({
        title: "Image Uploaded",
        description: error.toString(),
        status: "success",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setImage(null);
      setLoading(false);
    }
  };

  return {
    image,
    uploadedImage,
    loading,
    handleChangeImage,
    handleUploadImage,
  };
};

export default useUpload;
