import { Button, Heading, VStack, Image, HStack, Tag } from "@chakra-ui/react";
import React from "react";
import { useRef } from "react";
import useUpload from "./hook";

function Report() {
  const imageRef = useRef(null);
  const {
    loading,
    image,
    handleChangeImage,
    handleUploadImage,
    uploadedImage,
  } = useUpload();
  return (
    <div>
      <input
        style={{ display: "none" }}
        type="file"
        ref={imageRef}
        onChange={handleChangeImage}
      />
      <VStack>
        <Button
          onClick={() => imageRef.current.click()}
          colorScheme="blue"
          size="lg"
        >
          Select Image
        </Button>
      </VStack>
      {image && (
        <VStack my="4">
          <h1>{image.name}</h1>
          <Button
            onClick={handleUploadImage}
            variant="outline"
            colorScheme="green"
            isLoading={loading}
          >
            Upload
          </Button>
        </VStack>
      )}
    </div>
  );
}

export default Report;
