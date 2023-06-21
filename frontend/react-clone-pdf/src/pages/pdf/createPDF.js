import React, { useState } from "react";
import { Button, LinearProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import useRememberMe from "../../service/rememberMe";
import NavBar from "../../components/navbar";
import Footer from "../../components/footer";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { MuiFileInput } from "mui-file-input";
import { PDFDocument } from "pdf-lib";
import { saveAs } from "file-saver";

export default function CreatePDF() {
  useRememberMe();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [selectedImages, setSelectedImages] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [generatedPdf, setGeneratedPdf] = useState(null);

  const handleChange = (newFiles) => {
    if (
      newFiles &&
      newFiles.length > 0 &&
      (newFiles[0].type === "image/png" ||
        newFiles[0].type === "image/jpeg" ||
        newFiles[0].type === "image/jpg")
    ) {
      setSelectedImages([...selectedImages, ...newFiles]);
      setError(null);
    } else {
      setSelectedImages([]);
      setError("Please select PNG, JPEG, or JPG images.");
    }
  };

  const handleGeneratePdf = async () => {
    setError(null);

    if (selectedImages.length === 0) {
      setError("Please select images to generate PDF.");
      return;
    }

    try {
      const pdfDoc = await PDFDocument.create();

      for (let i = 0; i < selectedImages.length; i++) {
        const image = selectedImages[i];
        const reader = new FileReader();

        reader.onerror = () => {
          setError("Error reading the image file.");
        };

        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            const loaded =
              Array.from(selectedImages)
                .slice(0, i)
                .reduce((acc, f) => acc + f.size, 0) + event.loaded;
            const total = Array.from(selectedImages).reduce(
              (acc, f) => acc + f.size,
              0
            );
            const progress = Math.round((loaded / total) * 100);
            setUploadProgress(progress);
          }
        };

        await new Promise((resolve) => {
          reader.onload = () => {
            resolve();
          };
          reader.readAsArrayBuffer(image);
        });

        const arrayBuffer = reader.result;
        const embeddedImage = await pdfDoc.embedJpg(arrayBuffer);

        const page = pdfDoc.addPage();
        const { width, height } = embeddedImage.scaleToFit(
          page.getWidth(),
          page.getHeight()
        );
        const centerX = (page.getWidth() - width) / 2;
        const centerY = (page.getHeight() - height) / 2;
        page.drawImage(embeddedImage, {
          x: centerX,
          y: centerY,
          width,
          height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      setGeneratedPdf(blob);

      const fileName = `generated_${Date.now()}.pdf`;
      saveAs(blob, fileName); // Automatically download the PDF
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  const handleDeleteImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col h-screen justify-between">
      <NavBar />
      <div className="mb-auto flex flex-col justify-between">
        <div className="text-2xl font-semibold text-center py-6">
          Create a PDF from Images
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex mx-5 py-3 space-x-10 items-center justify-center">
            <div>
              <Controller
                name="imageFiles"
                control={control}
                render={({ field }) => (
                  <MuiFileInput
                    {...field}
                    onChange={handleChange}
                    value={selectedImages}
                    label="Upload Images"
                    placeholder="Select images"
                    error={!!errors.imageFiles}
                    helperText={errors.imageFiles?.message}
                    inputProps={{
                      accept: "image/png, image/jpeg, image/jpg",
                      multiple: true,
                    }}
                  />
                )}
              />
            </div>
            <div>
              <Button
                type="submit"
                onClick={handleGeneratePdf}
                variant="contained"
                startIcon={<AddAPhotoIcon />}
                size="large"
              >
                Create PDF
              </Button>
            </div>
          </div>
          {error && (
            <span className="flex justify-around text-red-500 text-sm mx-5">
              {error}
            </span>
          )}
          <div className="flex mt-2 mx-5 italic justify-center">
            Images of format .png .jpg and .jpeg are supported.
          </div>
        </form>
      </div>

      <div className="flex flex-col justify-evenly md:pt-5 md:mt-0 md:px-10 md:mx-5 mx-6 mt-5 shadow">
        <div>
          {uploadProgress > 0 && (
            <LinearProgress variant="determinate" value={uploadProgress} />
          )}
        </div>
        {generatedPdf && (
          <div className="flex justify-center my-5">
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              size="large"
              href={URL.createObjectURL(generatedPdf)}
              download={`generated_${Date.now()}.pdf`}
            >
              Download Generated PDF
            </Button>
          </div>
        )}
      </div>
      <div>
        {selectedImages.length > 0 && (
          <div className="my-5 mx-5 md:mx-12 md:px-12">
            <div className="font-semibold text-lg mb-2 text-center">
              Selected Images
            </div>
            <table className="table-fixed">
              <thead>
                <tr>
                  <th className="w-2/3 text-left">File Name</th>
                  <th className="w-1/3 text-left">Preview</th>
                  <th className="text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedImages.map((image, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 w-2/3">{image.name}</td>
                    <td className="py-2 w-1/3">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={image.name}
                        className="h-16 w-auto"
                      />
                    </td>
                    <td className="py-2 text-center">
                      <DeleteIcon
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        onClick={() => handleDeleteImage(index)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
