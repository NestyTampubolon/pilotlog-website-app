import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Button,
    Flex,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    RadioGroup,
    Radio, HStack,
    SimpleGrid,
    Heading,
    Icon,
    InputGroup,
    Select
} from '@chakra-ui/react';
import getCroppedImg from './cropImageFunction';
import ImageCrop from 'react-easy-crop';
import Card from "components/card/Card";
import { MdAdd } from "react-icons/md";
import { SketchPicker } from 'react-color';
import Avatar1 from "assets/img/avatars/avatar.png";
import { request, IMAGE_BASE_URL } from 'axios_helper.js';
import Swal from 'sweetalert2';
import {
    MdOutlineAdd
} from "react-icons/md";

function CertificatePreview({ templateSettings }) {
    const { croppedImage, name, date, training, logo, company, signature, CPTS} = templateSettings;
    const originalWidth = 28; // dalam cm
    const originalHeight = 21; // dalam cm
    const desiredWidth = 9.9; // dalam cm, setengah dari originalWidth

    // Hitung faktor skala untuk lebar
    const scale = desiredWidth / originalWidth;

    // Mengatur ukuran tinggi berdasarkan faktor skala lebar
    const previewWidth = desiredWidth; // dalam cm
    const previewHeight = originalHeight * scale; // dalam cm

    // Mengatur style untuk preview dengan skala yang benar
    const previewStyle = {
        width: `${previewWidth}cm`,
        height: `${previewHeight}cm`, // Menggunakan faktor skala untuk mengatur ukuran preview
        transformOrigin: 'top left', // Mengatur titik asal transformasi agar preview tetap berada di sudut kiri atas
    };

    // Mengatur style untuk konten dalam preview dengan skala yang sama
    const contentStyle = {
        transform: `scale(${scale})`, // Menggunakan kebalikan faktor skala untuk konten
    };

    return (
        <div className="certificate" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundImage: `url(${croppedImage})`, backgroundSize: 'cover', flexDirection: 'column', position : "relative",...previewStyle }}>
            <div style={{ left: `${name.positionX * scale}px`, textAlign: name.textAlign, top: `${name.positionY * scale}px`, fontSize: `${name.fontSize * scale}px`, color: name.color, width: `${name.width * scale}px`, height: `${name.height * scale}px`, fontWeight: 'bold', position:"absolute", borderWidth: '1px', borderStyle:'dashed' }}>{name.text}</div>
            <div style={{ left: `${date.positionX * scale}px`, textAlign: date.textAlign, top: `${date.positionY * scale}px`, fontSize: `${date.fontSize * scale}px`, color: date.color, width: `${date.width * scale}px`, height: `${date.height * scale}px`, position: "absolute", borderWidth: '1px', borderStyle: 'dashed' }}>{date.text}</div>
            <div style={{ left: `${training.positionX * scale}px`, textAlign: training.textAlign, top: `${training.positionY * scale}px`, fontSize: `${training.fontSize * scale}px`, color: training.color, width: `${training.width * scale}px`, height: `${training.height * scale}px`, position: "absolute", borderWidth: '1px', borderStyle: 'dashed' }}>{training.text} </div>
            <div style={{ left: `${company.positionX * scale}px`, textAlign: company.textAlign, top: `${company.positionY * scale}px`, fontSize: `${company.fontSize * scale}px`, color: company.color, width: `${company.width * scale}px`, height: `${company.height * scale}px`, position: "absolute", borderWidth: '1px', borderStyle: 'dashed' }}>{company.text} </div>
            <div style={{ left: `${CPTS.positionX * scale}px`, textAlign: CPTS.textAlign, top: `${CPTS.positionY * scale}px`, fontSize: `${CPTS.fontSize * scale}px`, color: CPTS.color, width: `${CPTS.width * scale}px`, height: `${CPTS.height * scale}px`, position: "absolute", borderWidth: '1px', borderStyle: 'dashed' }}><p style={{ fontWeight: 'bold' }}>{CPTS.text}</p> <p>Chief Pilot Training and Standart</p></div>
            <img src={logo.url} alt="Logo" style={{ width: `${logo.width * scale}px`, height: `${logo.height * scale}px`, position: 'absolute', left: `${logo.positionX * scale}px`, top: `${logo.positionY * scale}px`}} />
            <img src={signature.url} alt="Signature" style={{ backgroundColor: 'transparent', width: `${signature.width * scale}px`, height: `${signature.height * scale}px`, position: 'absolute', left: `${signature.positionX * scale}px`, top: `${signature.positionY * scale}px` }} />
        </div>
    );
}

export default function Certificate() {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [imageSrc, setImageSrc] = useState(null);
    const [signatureSrc, setSignatureSrc] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isModalSignantureOpen, setIsModalSignatureOpen] = useState(false);
    const [isCropping, setIsCropping] = useState(false);
    const [rotation, setRotation] = useState(0);
    const fileInputRef = useRef(null);
    const fileInputSignatureRef = useRef(null);
    const [data, setData] = useState();
    const [certificate, setCertificate] = useState();
    const [backgroundImage, setBackgroundImage] = useState();
    const [signatureImage, setSignatureImage] = useState();
    const [dataCPTS, setDataCPTS] = useState([]);
    const [idcpts, setIdcpts] = useState("");

    useEffect(() => {
        request("GET", "/api/v1/public/check/companycertificate", {}).then((response) => {
            setData(response.data);
        });
    }, []);

    useEffect(() => {
        if (data) {
            request("GET", "/api/v1/public/certificate", {}).then((response) => {
                setCertificate(response.data);
                console.log(response.data);
            });
        }
    }, [data]);

    useEffect(() => {
        request("GET", "/api/v1/admin/cpts", {}
        ).then((response) => {
            setDataCPTS(response.data);
        });
    }, []);

    useEffect(() => {
        if (dataCPTS.length > 0) {
            setIdcpts(dataCPTS[0].id_users);
            handleSettingsChange("CPTS", dataCPTS[0].name, "text")
        }
    }, [dataCPTS]);


    useEffect(() => {
        // Menetapkan templateSettings dengan menggunakan certificate
        setTemplateSettings(prevSettings => ({
            ...prevSettings,
            croppedImage: certificate ? IMAGE_BASE_URL + "background/" + certificate.backgroundImage : prevSettings.croppedImage,
            name: {
                ...prevSettings.name,
                color: certificate ? certificate.nameColor : prevSettings.name.color,
                fontSize: certificate ? certificate.nameFontSize : prevSettings.name.fontSize,
                positionX: certificate ? certificate.namePositionX : prevSettings.name.positionX,
                positionY: certificate ? certificate.namePositionY : prevSettings.name.positionY,
                width: certificate ? certificate.nameWidth : prevSettings.name.width,
                height: certificate ? certificate.nameHeight : prevSettings.name.height,
                textAlign: certificate ? certificate.nameTextAlign : prevSettings.name.textAlign
            },
            date: {
                ...prevSettings.date,
                color: certificate ? certificate.dateColor : prevSettings.date.color,
                fontSize: certificate ? certificate.dateFontSize : prevSettings.date.fontSize,
                positionX: certificate ? certificate.datePositionX : prevSettings.date.positionX,
                positionY: certificate ? certificate.datePositionY : prevSettings.date.positionY,
                width: certificate ? certificate.dateWidth : prevSettings.date.width,
                height: certificate ? certificate.dateHeight : prevSettings.date.height,
                textAlign: certificate ? certificate.dateTextAlign : prevSettings.date.textAlign
            },
            training: {
                ...prevSettings.training,
                color: certificate ? certificate.trainingColor : prevSettings.training.color,
                fontSize: certificate ? certificate.trainingFontSize : prevSettings.training.fontSize,
                positionX: certificate ? certificate.trainingPositionX : prevSettings.training.positionX,
                positionY: certificate ? certificate.trainingPositionY : prevSettings.training.positionY,
                width: certificate ? certificate.trainingWidth : prevSettings.training.width,
                height: certificate ? certificate.trainingHeight : prevSettings.training.height,
                textAlign: certificate ? certificate.trainingTextAlign : prevSettings.training.textAlign
            },
            company: {
                ...prevSettings.company,
                color: certificate ? certificate.companyColor : prevSettings.company.color,
                fontSize: certificate ? certificate.companyFontSize : prevSettings.company.fontSize,
                positionX: certificate ? certificate.companyPositionX : prevSettings.company.positionX,
                positionY: certificate ? certificate.companyPositionY : prevSettings.company.positionY,
                width: certificate ? certificate.companyWidth : prevSettings.company.width,
                height: certificate ? certificate.companyHeight : prevSettings.company.height,
                textAlign: certificate ? certificate.companyTextAlign : prevSettings.company.textAlign
            },
            logo: {
                ...prevSettings.logo,
                url: certificate ? IMAGE_BASE_URL + certificate.companyId.logo : prevSettings.logo.url,
                width: certificate ? certificate.logoWidth : prevSettings.logo.width,
                height: certificate ? certificate.logoHeight : prevSettings.logo.height,
                positionX: certificate ? certificate.logoPositionX : prevSettings.logo.positionX,
                positionY: certificate ? certificate.logoPositionY : prevSettings.logo.positionY
            },
            signature: {
                ...prevSettings.signature,
                url: certificate ? IMAGE_BASE_URL + "cptssignature/" + certificate.signature : prevSettings.signature.url,
                width: certificate ? certificate.signatureWidth : prevSettings.signature.width,
                height: certificate ? certificate.signatureHeight : prevSettings.signature.height,
                positionX: certificate ? certificate.signaturePositionX : prevSettings.signature.positionX,
                positionY: certificate ? certificate.signaturePositionY : prevSettings.signature.positionY
            },
            CPTS: {
                ...prevSettings.CPTS,
                color: certificate ? certificate.cptsColor : prevSettings.CPTS.color,
                width: certificate ? certificate.cptsWidth : prevSettings.CPTS.width,
                height: certificate ? certificate.cptsHeight : prevSettings.CPTS.height,
                positionX: certificate ? certificate.cptsPositionX : prevSettings.CPTS.positionX,
                positionY: certificate ? certificate.cptsPositionY : prevSettings.CPTS.positionY,
                textAlign: certificate ? certificate.cptsTextAlign : prevSettings.CPTS.textAlign,
                fontSize: certificate ? certificate.cptsFontSize : prevSettings.CPTS.fontSize,
            },
        }));
    }, [certificate]);


    const [templateSettings, setTemplateSettings] = useState({
        // Default template settings
        croppedImage: '',
        name: {
            text: certificate ? certificate.nameText : 'John Doe',
            color: '#000000',
            fontSize: 24,
            positionX: 300,
            positionY: 200,
            width: 400,
            height: 20,
            textAlign: 'center'
        },
        date: {
            text: 'April 12, 2024',
            color: '#000000',
            fontSize: 18,
            positionX: 120,
            positionY: 500,
            width: 150,
            height: 20,
            textAlign: 'center'
        },
        training: {
            text: 'Reduced Vertical Separation Minima',
            color: '#000000',
            fontSize: 20,
            positionX: 300,
            positionY: 200,
            width: 400,
            height: 40,
            textAlign: 'center'
        },
        company: {
            text: 'PT Indonesia AirAsia',
            color: '#000000',
            fontSize: 22,
            positionX: 700,
            positionY: 700,
            width: 200,
            height: 20,
            textAlign: 'center'
        },
        logo: {
            url: Avatar1,
            width: 100,
            height: 100,
            positionX: 20,
            positionY: 20,
        },
        signature: {
            url: Avatar1,
            width: 150,
            height: 150,
            positionX: 125,
            positionY: 550,
        },
        CPTS: {
            idcpts: idcpts,
            text: '',
            color: '#000000',
            fontSize: 20,
            positionX: 100,
            positionY: 700,
            width: 300,
            height: 20,
            textAlign: 'center'
        },
    });


    const onCropComplete = (croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file.size < 1024 * 1024) { // 1MB
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
            };
            reader.readAsDataURL(file);

            setIsModalOpen(true);
        } else {
            Swal.fire({
                icon: "error",
                title: "Something went wrong!",
                text: "The file size is too large! Please select a file that is less than 1MB."
            });
        }
    };


    const handleCropImage = async () => {
        try {
            setIsCropping(true);
            // Pastikan croppedImage sudah ada sebelum mencoba untuk memotong
            if (imageSrc) {
                const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);
                setIsCropping(false);
                // Handle the cropped image
                console.log('Cropped image:', croppedImage);
                setImageSrc(croppedImage);
                setBackgroundImage(croppedImage);

                setTemplateSettings({ ...templateSettings, croppedImage });
                setIsModalOpen(false);
            } else {
                setIsCropping(false);
                console.error('Error cropping image: No image selected');
            }
        } catch (error) {
            console.error('Error cropping image:', error);
            setIsCropping(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleClickSignature = () => {
        fileInputSignatureRef.current.click();
    };

    const handleFileSignature = (e) => {
        const file = e.target.files[0];
        if (file.size < 1024 * 1024) { // 1MB
            const reader = new FileReader();
            reader.onload = () => {
                const dataURL = reader.result;
                setSignatureSrc(dataURL); // Set the data URL as the source for the image
                // Assuming setTemplateSettings is a function to update state
                setTemplateSettings(prevSettings => ({
                    ...prevSettings,
                    signature: {
                        ...prevSettings.signature,
                        url: dataURL // Set the data URL as the URL in the signature object
                    }
                }));
            };
            reader.readAsDataURL(file); // Read file as data URL
        } else {
            Swal.fire({
                icon: "error",
                title: "Something went wrong!",
                text: "The file size is too large! Please select a file that is less than 1MB."
            });
        }
    };

    const handleSettingsChange = (name, value, type) => {
        let newValue;
        switch (type) {
            case "color":
                newValue = value.hex;
                break;
            case "fontSize":
            case "positionX":
            case "positionY":
            case "width":
            case "height":
                newValue = parseInt(value.target.value);
                break;
            case "textAlign":
            case "text":
                newValue = value;
                break;
            default:
                newValue = value;
                break;
        }

        setTemplateSettings({
            ...templateSettings,
            [name]: {
                ...templateSettings[name],
                [type]: newValue
            }
        });
    };



    const handleSubmit = (event) => {
        const { signature, name, date, training, logo, company, CPTS } = templateSettings;
        event.preventDefault();
        console.log(idcpts);
        request("POST", "/api/v1/admin/addCertificate", {
            nameText: name.text, nameColor: name.color, nameFontSize: name.fontSize, namePositionX: name.positionX,
            namePositionY: name.positionX, nameWidth: name.width, nameHeight: name.height, nameTextAlign: name.textAlign,
            dateText: date.text, dateColor: date.color, dateFontSize: date.fontSize, datePositionX: date.positionX,
            datePositionY: date.positionY, dateWidth: date.width, dateHeight: date.height, dateTextAlign: date.textAlign,
            trainingText: training.text, trainingColor: training.color, trainingFontSize: training.fontSize, trainingPositionX: training.positionX,
            trainingPositionY: training.positionY, trainingWidth: training.width, trainingHeight: training.height, trainingTextAlign: training.textAlign,
            companyText: company.text, companyColor: company.color, companyFontSize: company.fontSize, companyPositionX: company.positionX,
            companyPositionY: company.positionY, companyWidth: company.width, companyHeight: company.height, companyTextAlign: company.textAlign,
            logoWidth: logo.width, logoHeight: logo.height, logoPositionX: logo.positionX, logoPositionY: logo.positionY,
            signatureWidth: signature.width, signatureHeight: signature.height, signaturePositionX: signature.positionX, signaturePositionY: signature.positionY,
            idcpts: idcpts, cptsColor: CPTS.color, cptsFontSize: CPTS.fontSize, cptsPositionX: CPTS.positionX,
            cptsPositionY: CPTS.positionY, cptsWidth: CPTS.width, cptsHeight: CPTS.height, cptsTextAlign: CPTS.textAlign

        }
        ).then((response) => {
            window.location.reload();
        }).catch((error) => {
            // Jika terjadi kesalahan, tampilkan pesan error
            console.log("Error:", error);
        });
    }

    const fetchBlobData = async (blobUrl) => {
        const response = await fetch(blobUrl);
        const blob = await response.blob();
        return blob;
    };

    const handleUpdate = () => {
        if (certificate) {
            const { signature, name, date, training, logo, company, CPTS } = templateSettings;
            console.log(idcpts);
            request("PUT", "/api/v1/admin/certificate/update/" + certificate.id_certificate, {
                nameText: name.text, nameColor: name.color, nameFontSize: name.fontSize, namePositionX: name.positionX,
                namePositionY: name.positionY, nameWidth: name.width, nameHeight: name.height, nameTextAlign: name.textAlign,
                dateText: date.text, dateColor: date.color, dateFontSize: date.fontSize, datePositionX: date.positionX,
                datePositionY: date.positionY, dateWidth: date.width, dateHeight: date.height, dateTextAlign: date.textAlign,
                trainingText: training.text, trainingColor: training.color, trainingFontSize: training.fontSize, trainingPositionX: training.positionX,
                trainingPositionY: training.positionY, trainingWidth: training.width, trainingHeight: training.height, trainingTextAlign: training.textAlign,
                companyText: company.text, companyColor: company.color, companyFontSize: company.fontSize, companyPositionX: company.positionX,
                companyPositionY: company.positionY, companyWidth: company.width, companyHeight: company.height, companyTextAlign: company.textAlign,
                logoWidth: logo.width, logoHeight: logo.height, logoPositionX: logo.positionX, logoPositionY: logo.positionY,
                signatureWidth: signature.width, signatureHeight: signature.height, signaturePositionX: signature.positionX, signaturePositionY: signature.positionY,
                idcpts: idcpts, cptsColor: CPTS.color, cptsFontSize: CPTS.fontSize, cptsPositionX: CPTS.positionX,
                cptsPositionY: CPTS.positionY, cptsWidth: CPTS.width, cptsHeight: CPTS.height, cptsTextAlign: CPTS.textAlign
            }
            ).then(async (response) => {
                if (response.status === 200) {
                    if (backgroundImage) {
                        
                        const blobData = await fetchBlobData(backgroundImage);
                        request("PUT", `/api/v1/admin/certificate/update/background/${certificate.id_certificate}`, { backgroundImage: blobData }, 'multipart/form-data')
                            .then((response) => {
                                if (response.status === 200) {
                                    handleCloseModal();
                                }
                            }).catch((error) => {
                                // Jika terjadi kesalahan, tampilkan pesan error
                                console.log("Error:", error);
                            });
                    }
                    if (signature.url) {
                        const blobData = await fetchBlobData(signature.url);
                        request("PUT", `/api/v1/admin/certificate/update/signature/${certificate.id_certificate}`, { signature: blobData }, 'multipart/form-data')
                            .then((response) => {
                                if (response.status === 200) {
                                
                                }
                            }).catch((error) => {
                                // Jika terjadi kesalahan, tampilkan pesan error
                                console.log("Error:", error);
                            });
                    }
                    Swal.fire({
                        title: "Success!",
                        text: "Successfully change company",
                        icon: "success"
                    });
                    // window.location.reload();
                }
            }).catch((error) => {
                // Jika terjadi kesalahan, tampilkan pesan error
                console.log("Error:", error);
            });
        }
    }

    return (
        <Box pt={{ base: "100px", md: "80px", xl: "80px" }}>
            {data ? (
                <Flex>
                    <Flex flexDirection={'row'} style={{ paddingBottom: '20px' }}>
                        <Card flex='3' py='15px' style={{ maxHeight: '80vh', overflowY: 'auto' }}>
                            <FormControl mb='20px'>
                                <FormLabel>Upload Background Image</FormLabel>
                                <Button leftIcon={<MdAdd />} variant="brand" onClick={handleClick}>
                                    Add Background Image
                                    <Input type="file" name="backgroundImage" accept="image/*" onChange={handleFileChange} ref={fileInputRef} hidden />
                                </Button>
                            </FormControl>
                            <Box mb="20px">
                                <Heading size="md" mb="10px" color="yellow.500">Logo Settings</Heading>
                                <SimpleGrid columns={{ base: 1, md: 4, xl: 4 }} gap='20px' mb='20px'>
                                    <FormControl>
                                        <FormLabel>Logo Position X</FormLabel>
                                        <Input type="number" name="logoPositionX" value={templateSettings.logo.positionX} onChange={(e) => handleSettingsChange("logo", e, "positionX")} variant='main' />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Logo Position Y</FormLabel>
                                        <Input type="number" name="logoPositionY" value={templateSettings.logo.positionY} onChange={(e) => handleSettingsChange("logo", e, "positionY")} variant='main' />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Logo Width</FormLabel>
                                        <Input type="number" name="logoWidth" value={templateSettings.logo.width} onChange={(e) => handleSettingsChange("logo", e, "width")} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Logo Height</FormLabel>
                                        <Input type="number" name="logoHeight" value={templateSettings.logo.height} onChange={(e) => handleSettingsChange("logo", e, "height")} />
                                    </FormControl>
                                </SimpleGrid>
                            </Box>

                            <Box mb="20px">
                                <Heading size="md" mb="10px" color="blue.500">Company Settings</Heading>
                                <SimpleGrid columns={{ base: 1, md: 5, xl: 5 }} gap='20px' mb='20px'>
                                    <FormControl>
                                        <FormLabel>Company</FormLabel>
                                        <Input type="text" name="company" value={templateSettings.company.text} onChange={(e) => handleSettingsChange("company", e.target.value, "text")} variant='main' />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Company Position X</FormLabel>
                                        <Input type="number" name="positionX" value={templateSettings.company.positionX} onChange={(e) => handleSettingsChange("company", e, "positionX")} variant='main' />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Company Position Y</FormLabel>
                                        <Input type="number" name="positionY" value={templateSettings.company.positionY} onChange={(e) => handleSettingsChange("company", e, "positionY")} variant='main' />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Company Width</FormLabel>
                                        <Input type="number" name="companyWidth" value={templateSettings.company.width} onChange={(e) => handleSettingsChange("company", e, "width")} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Company Height</FormLabel>
                                        <Input type="number" name="companyHeight" value={templateSettings.company.height} onChange={(e) => handleSettingsChange("company", e, "height")} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Company Color</FormLabel>
                                        <SketchPicker color={templateSettings.company.color} onChange={(color) => handleSettingsChange("company", color, "color")} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Company Font Size</FormLabel>
                                        <Input type="number" name="companyFontSize" value={templateSettings.company.fontSize} onChange={(e) => handleSettingsChange("company", e, "fontSize")} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Text Alignment</FormLabel>
                                        <RadioGroup defaultValue="center" onChange={(e) => handleSettingsChange("company", e, "textAlign")}>
                                            <HStack spacing="24px">
                                                <Radio value="left">Left</Radio>
                                                <Radio value="center">Center</Radio>
                                                <Radio value="right">Right</Radio>
                                            </HStack>
                                        </RadioGroup>
                                    </FormControl>
                                </SimpleGrid>
                            </Box>

                            <Box mb="20px">
                                <Heading size="md" mb="10px" color="blue.500">Name Settings</Heading>
                                <SimpleGrid columns={{ base: 1, md: 5, xl: 5 }} gap='20px' mb='20px'>
                                    <FormControl>
                                        <FormLabel>Name</FormLabel>
                                        <Input type="text" name="name" value={templateSettings.name.text} onChange={(e) => handleSettingsChange("name", e.target.value, "text")} variant='main' />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Name Position X</FormLabel>
                                        <Input type="number" name="positionX" value={templateSettings.name.positionX} onChange={(e) => handleSettingsChange("name", e, "positionX")} variant='main' />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Name Position Y</FormLabel>
                                        <Input type="number" name="positionY" value={templateSettings.name.positionY} onChange={(e) => handleSettingsChange("name", e, "positionY")} variant='main' />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Name Width</FormLabel>
                                        <Input type="number" name="nameWidth" value={templateSettings.name.width} onChange={(e) => handleSettingsChange("name", e, "width")} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Name Height</FormLabel>
                                        <Input type="number" name="nameHeight" value={templateSettings.name.height} onChange={(e) => handleSettingsChange("name", e, "height")} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Name Color</FormLabel>
                                        <SketchPicker color={templateSettings.name.color} onChange={(color) => handleSettingsChange("name", color, "color")} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Name Font Size</FormLabel>
                                        <Input type="number" name="nameFontSize" value={templateSettings.name.fontSize} onChange={(e) => handleSettingsChange("name", e, "fontSize")} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Text Alignment</FormLabel>
                                        <RadioGroup defaultValue="center" onChange={(e) => handleSettingsChange("name", e, "textAlign")}>
                                            <HStack spacing="24px">
                                                <Radio value="left">Left</Radio>
                                                <Radio value="center">Center</Radio>
                                                <Radio value="right">Right</Radio>
                                            </HStack>
                                        </RadioGroup>
                                    </FormControl>
                                </SimpleGrid>
                            </Box>

                            <Box mb="20px">
                                <Heading size="md" mb="10px" color="blue.500">Date Settings</Heading>  <SimpleGrid columns={{ base: 1, md: 5, xl: 5 }} gap='20px' mb='20px'>
                                    <FormControl>
                                        <FormLabel>Date</FormLabel>
                                        <Input type="text" name="date" value={templateSettings.date.text} onChange={(e) => handleSettingsChange("date", e.target.value, "text")} variant='main' />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Date Position X</FormLabel>
                                        <Input type="number" name="datePositionX" value={templateSettings.date.positionX} onChange={(e) => handleSettingsChange("date", e, "positionX")} variant='main' />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Date Position Y</FormLabel>
                                        <Input type="number" name="datePositionY" value={templateSettings.date.positionY} onChange={(e) => handleSettingsChange("date", e, "positionY")} variant='main' />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Date Width</FormLabel>
                                        <Input type="number" name="dateWidth" value={templateSettings.date.width} onChange={(e) => handleSettingsChange("date", e, "width")} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Date Height</FormLabel>
                                        <Input type="number" name="dateHeight" value={templateSettings.date.height} onChange={(e) => handleSettingsChange("date", e, "height")} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Date Color</FormLabel>
                                        <SketchPicker color={templateSettings.date.color} onChange={(e) => handleSettingsChange("date", e, "color")} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Date Font Size</FormLabel>
                                        <Input type="number" name="dateFontSize" value={templateSettings.date.fontSize} onChange={(e) => handleSettingsChange("date", e, "fontSize")} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Text Alignment</FormLabel>
                                        <RadioGroup defaultValue="center" onChange={(e) => handleSettingsChange("date", e, "textAlign")}>
                                            <HStack spacing="24px">
                                                <Radio value="left">Left</Radio>
                                                <Radio value="center">Center</Radio>
                                                <Radio value="right">Right</Radio>
                                            </HStack>
                                        </RadioGroup>
                                    </FormControl>
                                </SimpleGrid>
                            </Box>


                            <Box mb="20px">
                                <Heading size="md" mb="10px" color="blue.500">Training Settings</Heading><SimpleGrid columns={{ base: 1, md: 5, xl: 5 }} gap='20px' mb='20px'>
                                    <FormControl>
                                        <FormLabel>Training</FormLabel>
                                        <Input type="text" name="training" value={templateSettings.training.text} onChange={(e) => handleSettingsChange("training", e.target.value, "text")} variant='main' />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Training Position X</FormLabel>
                                        <Input type="number" name="trainingPositionX" value={templateSettings.training.positionX} onChange={(e) => handleSettingsChange("training", e, "positionX")} variant='main' />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Training Position Y</FormLabel>
                                        <Input type="number" name="trainingPositionY" value={templateSettings.training.positionY} onChange={(e) => handleSettingsChange("training", e, "positionY")} variant='main' />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Training Width</FormLabel>
                                        <Input type="number" name="trainingWidth" value={templateSettings.training.width} onChange={(e) => handleSettingsChange("training", e, "width")} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Training Height</FormLabel>
                                        <Input type="number" name="trainingHeight" value={templateSettings.training.height} onChange={(e) => handleSettingsChange("training", e, "height")} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Training Color</FormLabel>
                                        <SketchPicker color={templateSettings.training.color} onChange={(e) => handleSettingsChange("training", e, "color")} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Training Font Size</FormLabel>
                                        <Input type="number" name="trainingFontSize" value={templateSettings.training.fontSize} onChange={(e) => handleSettingsChange("training", e, "fontSize")} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Text Alignment</FormLabel>
                                        <RadioGroup defaultValue="center" onChange={(e) => handleSettingsChange("date", e, "textAlign")}>
                                            <HStack spacing="24px">
                                                <Radio value="left">Left</Radio>
                                                <Radio value="center">Center</Radio>
                                                <Radio value="right">Right</Radio>
                                            </HStack>
                                        </RadioGroup>
                                    </FormControl>
                                </SimpleGrid>
                            </Box>

                            <Box mb="20px">
                                <Heading size="md" mb="10px" color="blue.500">Company Settings</Heading>
                                <SimpleGrid columns={{ base: 1, md: 5, xl: 5 }} gap='20px' mb='20px'>
                                    <FormControl>
                                        <FormLabel >
                                            CPTS
                                        </FormLabel>
                                        <InputGroup size='md'>
                                            <Select
                                                name='idcpts'
                                                value={idcpts}
                                                onChange={(event) => {
                                                    const selectedId = event.target.value;
                                                    setIdcpts(selectedId);
                                                    const selectedName = dataCPTS.find(item => item.id === selectedId)?.name;
                                                    handleSettingsChange("CPTS", event.target.value, "idcpts");
                                                    handleSettingsChange("CPTS", selectedName, "text")
                                                }}
                                                isRequired={true}
                                                fontSize='sm'
                                                size='lg'
                                                variant='main'
                                            >
                                                {dataCPTS.map((item) => (
                                                    <option key={item.id} value={item.id_users}>{item.name}</option>
                                                ))}
                                            </Select>

                                        </InputGroup>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>CPTS Position X</FormLabel>
                                        <Input type="number" name="positionX" value={templateSettings.CPTS.positionX} onChange={(e) => handleSettingsChange("CPTS", e, "positionX")} variant='main' />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>CPTS Position Y</FormLabel>
                                        <Input type="number" name="positionY" value={templateSettings.CPTS.positionY} onChange={(e) => handleSettingsChange("CPTS", e, "positionY")} variant='main' />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>CPTS Width</FormLabel>
                                        <Input type="number" name="CPTSWidth" value={templateSettings.CPTS.width} onChange={(e) => handleSettingsChange("CPTS", e, "width")} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>CPTS Height</FormLabel>
                                        <Input type="number" name="CPTSHeight" value={templateSettings.CPTS.height} onChange={(e) => handleSettingsChange("CPTS", e, "height")} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>CPTS Color</FormLabel>
                                        <SketchPicker color={templateSettings.CPTS.color} onChange={(color) => handleSettingsChange("CPTS", color, "color")} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>CPTS Font Size</FormLabel>
                                        <Input type="number" name="CPTSFontSize" value={templateSettings.CPTS.fontSize} onChange={(e) => handleSettingsChange("CPTS", e, "fontSize")} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Text Alignment</FormLabel>
                                        <RadioGroup defaultValue="center" onChange={(e) => handleSettingsChange("CPTS", e, "textAlign")}>
                                            <HStack spacing="24px">
                                                <Radio value="left">Left</Radio>
                                                <Radio value="center">Center</Radio>
                                                <Radio value="right">Right</Radio>
                                            </HStack>
                                        </RadioGroup>
                                    </FormControl>
                                </SimpleGrid>
                            </Box>
                            <Box mb="20px">
                                <Heading size="md" mb="10px" color="yellow.500">Signature CPTS Settings</Heading>
                                <SimpleGrid columns={{ base: 1, md: 4, xl: 4 }} gap='20px' mb='20px'>
                                    <FormControl>
                                        <FormLabel>Upload</FormLabel>
                                        <Button leftIcon={<MdAdd />} variant="brand" onClick={handleClickSignature}>
                                            Upload
                                            <Input type="file" name="signature" accept="image/*" onChange={handleFileSignature} ref={fileInputSignatureRef} hidden />
                                        </Button>
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Signature Position X</FormLabel>
                                        <Input type="number" name="signaturePositionX" value={templateSettings.signature.positionX} onChange={(e) => handleSettingsChange("signature", e, "positionX")} variant='main' />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Signature Position Y</FormLabel>
                                        <Input type="number" name="signaturePositionY" value={templateSettings.signature.positionY} onChange={(e) => handleSettingsChange("signature", e, "positionY")} variant='main' />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Signature Width</FormLabel>
                                        <Input type="number" name="signatureWidth" value={templateSettings.signature.width} onChange={(e) => handleSettingsChange("signature", e, "width")} />
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel>Signature Height</FormLabel>
                                        <Input type="number" name="signatureHeight" value={templateSettings.signature.height} onChange={(e) => handleSettingsChange("signature", e, "height")} />
                                    </FormControl>
                                </SimpleGrid>
                            </Box>

                            
                        </Card>
                        <Card flex='2' ml='10px' alignItems={'center'}>
                            <CertificatePreview templateSettings={templateSettings} />
                            <Flex width='100%' align='center' mt={'20px'}>
                                <Button
                                    onClick={handleUpdate}
                                    fontSize='sm'
                                    variant='brand'
                                    fontWeight='500'
                                    w='100%'
                                    h='50'
                                    mb='24px'>
                                    Save
                                </Button>
                            </Flex>
                        </Card>
                    </Flex>
                    {/* Background Image */}
                    <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Crop Image</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                {imageSrc && (
                                    <Box position="relative" width="100%" height="400px">
                                        <ImageCrop
                                            image={imageSrc}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={4 / 3} // Sesuaikan dengan aspek rasio yang diinginkan
                                            onCropChange={setCrop}
                                            onCropComplete={onCropComplete}
                                            onZoomChange={setZoom}
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        />
                                    </Box>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="brand" mr={3} onClick={handleCropImage}>Save</Button>
                                <Button onClick={handleCloseModal}>Cancel</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                    {/* Signature */}
                    {/* <Modal isOpen={isModalSignantureOpen} onClose={handleCloseModalSignature}>
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Crop Image Signature</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody>
                                {signatureSrc && (
                                    <Box position="relative" width="100%" height="400px" backgroundColor='transparent'>
                                        <ImageCrop
                                            image={signatureSrc}
                                            crop={crop}
                                            zoom={zoom}
                                            aspect={4 / 3} 
                                            onCropChange={setCrop}
                                            onCropComplete={onCropComplete}
                                            onZoomChange={setZoom}
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        />
                                    </Box>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button colorScheme="brand" mr={3} onClick={handleCropSignature}>Save</Button>
                                <Button onClick={handleCloseModalSignature}>Cancel</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal> */}
                </Flex>
            ) : (<Button
                onClick={handleSubmit}
                fontSize='sm'
                variant='brand'
                fontWeight='500'
                w='100%'
                h='50'
                mb='24px'>
                <Icon
                    as={MdOutlineAdd}
                    color='white'
                    w='20px'
                    h='20px'
                    fontWeight='2000'
                    marginRight={'5px'}
                />

                Create Certificate
            </Button>)}
        </Box>
    );
}
