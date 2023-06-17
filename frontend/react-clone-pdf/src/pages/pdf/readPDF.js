import React, { useState } from "react";
import { Button, LinearProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import useRememberMe from "../../service/rememberMe";
import NavBar from "../../components/navbar";
import Footer from "../../components/footer";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { MuiFileInput } from "mui-file-input";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import "@react-pdf-viewer/core/lib/styles/index.css";

export default function ReadPDF() {
  useRememberMe();

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();
  const [pdfFile, setPDFFile] = useState(null);
  const [pdfUrl, setPdfUrl] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleChange = (newFile) => {
    if (newFile && newFile.type === "application/pdf") {
      setPDFFile(newFile);
      setError(null);
    } else {
      setPDFFile(null);
      setError("Please select a PDF file.");
    }
  };

  const handleFileUpload = () => {
    if (!pdfFile) {
      setError("Please select a PDF file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const uploadedPdfUrl = reader.result;
      setPdfUrl(uploadedPdfUrl);
    };

    reader.onerror = () => {
      setError("Error reading the PDF file.");
    };

    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(progress);
      }
    };

    reader.readAsDataURL(pdfFile);
  };

  const onSubmit = (data) => {
    console.log(data);
    // Handle form submission
  };

  return (
    <div className="flex flex-col h-screen justify-between">
      <NavBar />
      <div className="mb-auto">
        <div className="text-2xl font-semibold text-center py-6">
          Preview a PDF File
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex mx-5 py-3 space-x-10 items-center justify-center">
            <div>
              <Controller
                name="pdfFile"
                control={control}
                rules={{
                  required: "Select a PDF.",
                  validate: (value) =>
                    value[0]?.type === "application/pdf" ||
                    "Only PDF files are allowed.",
                }}
                render={({ field }) => (
                  <MuiFileInput
                    {...field}
                    onChange={handleChange}
                    value={pdfFile}
                    label="Upload PDF"
                    placeholder="Select a file"
                    error={!!errors.pdfFile}
                    helperText={errors.pdfFile?.message}
                    inputProps={{
                      accept: ".pdf",
                    }}
                  />
                )}
              />
            </div>
            <div>
              <Button
                type="submit"
                onClick={handleFileUpload}
                variant="contained"
                startIcon={<FileUploadIcon />}
                size="large"
              >
                Upload PDF
              </Button>
            </div>
          </div>
          <div className="flex mx-5 italic justify-center">
            Tip: Since, all your files are processed locally, smaller files are
            processed faster.
          </div>
        </form>
      </div>
      <div className="p-10 m-5 shadow">
        {uploadProgress > 0 && (
          <LinearProgress variant="determinate" value={uploadProgress} />
        )}
        {pdfUrl && (
          <div style={{ height: "100vh" }}>
            <Viewer fileUrl={pdfUrl} plugins={[defaultLayoutPluginInstance]} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
