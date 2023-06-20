import React, { useState } from "react";
import { Button, LinearProgress } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import useRememberMe from "../../service/rememberMe";
import NavBar from "../../components/navbar";
import Footer from "../../components/footer";
import CallMergeIcon from "@mui/icons-material/CallMerge";
import DownloadIcon from "@mui/icons-material/Download";
import DeleteIcon from "@mui/icons-material/Delete";
import { MuiFileInput } from "mui-file-input";
import { saveAs } from "file-saver";
import { PDFDocument } from "pdf-lib";

export default function CompressPDF() {
  useRememberMe();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const [pdfFile, setPDFFile] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [mergedFile, setMergedFile] = useState(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleChange = (newFiles) => {
    if (
      newFiles &&
      newFiles.length > 0 &&
      newFiles[0].type === "application/pdf"
    ) {
      setPDFFile([...pdfFile, ...newFiles]);
      setSelectedFiles([...selectedFiles, ...newFiles]);
      setError(null);
    } else {
      setPDFFile([]);
      setError("Please select a PDF file.");
    }
  };

  const handleFileUpload = async () => {
    setError(null);

    if (pdfFile.length <= 1) {
      setError("Please select at least 2 PDF files.");
      return;
    }

    try {
      const mergedPdf = await PDFDocument.create();
      const totalFiles = pdfFile.length;

      for (let i = 0; i < totalFiles; i++) {
        const file = pdfFile[i];
        const reader = new FileReader();

        reader.onerror = () => {
          setError("Error reading the PDF file.");
        };

        reader.onprogress = (event) => {
          if (event.lengthComputable) {
            const loaded =
              Array.from(pdfFile)
                .slice(0, i)
                .reduce((acc, f) => acc + f.size, 0) + event.loaded;
            const total = Array.from(pdfFile).reduce(
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
          reader.readAsArrayBuffer(file);
        });

        const arrayBuffer = reader.result;
        const pdfDoc = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(
          pdfDoc,
          pdfDoc.getPageIndices()
        );
        copiedPages.forEach((page) => {
          mergedPdf.addPage(page);
        });
      }

      const mergedPdfBytes = await mergedPdf.save();

      const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });
      const fileName = `merged_${Date.now()}.pdf`;
      saveAs(blob, fileName);
      setMergedFile(blob);
    } catch (error) {
      console.error("Error merging PDFs:", error);
    }
  };

  const handleDeleteFile = (index) => {
    const updatedFiles = [...pdfFile];
    updatedFiles.splice(index, 1);
    setPDFFile(updatedFiles);
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="flex flex-col h-screen justify-between">
      <NavBar />
      <div className="mb-auto flex flex-col justify-between">
        <div className="text-2xl font-semibold text-center py-6">
          Merge PDF Files
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex mx-5 py-3 space-x-10 items-center justify-center">
            <div>
              <Controller
                name="pdfFile"
                control={control}
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
                      multiple: true,
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
                startIcon={<CallMergeIcon />}
                size="large"
              >
                Merge PDFs
              </Button>
            </div>
          </div>
          {error && (
            <span className="flex justify-around text-red-500 text-sm mx-5">
              {error}
            </span>
          )}
          <div className="flex mt-2 mx-5 italic justify-center">
            Tip: It takes longer to merge when many files are selected.
          </div>
        </form>
      </div>

      <div>
        {pdfFile.length > 0 && (
          <div className="my-5 mx-5 md:mx-12 md:px-12">
            <div className="font-semibold text-lg mb-2 text-center">
              Selected PDFs
            </div>
            <table className="table-fixed">
              <thead>
                <tr>
                  <th className="w-2/3 text-left">File Name</th>
                  <th className="w-1/3 text-left">File Size</th>
                  <th className="text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {pdfFile.map((file, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2 w-2/3">{file.name}</td>
                    <td className="py-2 w-1/3">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </td>
                    <td className="py-2 text-center">
                      <DeleteIcon
                        className="text-red-500 hover:text-red-700 cursor-pointer"
                        onClick={() => handleDeleteFile(index)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-evenly md:pt-5 md:mt-0 md:px-10 md:mx-5 mx-6 mt-5 shadow">
        <div>
          {uploadProgress > 0 && (
            <LinearProgress variant="determinate" value={uploadProgress} />
          )}
        </div>
        {mergedFile && (
          <div className="flex justify-center my-5">
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              size="large"
              href={URL.createObjectURL(mergedFile)}
              download={`merged_${Date.now()}.pdf`}
            >
              Download Merged PDF
            </Button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
