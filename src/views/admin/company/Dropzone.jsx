import { Button, Flex, Input, useColorModeValue, Image, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import Swal from 'sweetalert2';

function Dropzone(props) {
    const { content, setLogo, ...rest } = props;
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const { getRootProps, getInputProps } = useDropzone({
        accept: "image/*",
        maxSize: 1024 * 1024,
        onDrop: (acceptedFiles) => {
            if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0];
                if (file.size <= 1024 * 1024) {
                    const reader = new FileReader();
                    reader.onload = () => {
                        const base64String = reader.result.split(',')[1]; // Ambil bagian base64 dari hasil pembacaan
                        setLogo(file); // Mengirimkan objek file ke setLogo
                    };
                    reader.readAsDataURL(file); // Baca file sebagai URL data (base64)
                    setImage(URL.createObjectURL(file));
                    setErrorMessage("");
                } else {
                    setErrorMessage("File size exceeds 1 MB limit.");
                }
            }
        }
    });
    const bg = useColorModeValue("gray.100", "navy.700");
    const borderColor = useColorModeValue("secondaryGray.100", "whiteAlpha.100");

    return (
        <Flex flexDirection='column'>
            <Flex
                align='center'
                justify='center'
                bg={bg}
                border='1px dashed'
                borderColor={borderColor}
                borderRadius='16px'
                w='100%'
                h='350px'
                minH='100%'
                cursor='pointer'
                {...getRootProps({ className: "dropzone" })}
                {...rest}
            >
                <Input variant='main' {...getInputProps()} />
                {image ? (
                    <Image src={image} alt="Uploaded" maxH="250px" maxW="250px" />
                ) : (
                    <Button variant='no-effects'>{content}</Button>
                )}
                {errorMessage && (
                    <Text color="red.500" mt={2}>
                        {errorMessage}
                    </Text>
                )}
                
            </Flex>
            <Text color="red.500" mt={2}>
                *File size exceeds 1 MB limit.
            </Text>
        </Flex>
    );
}

export default Dropzone;
