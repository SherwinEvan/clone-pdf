import { Button } from "@mui/material";
import NavBar from "../components/navbar";
import Footer from "../components/footer";
import useRememberMe from "../service/rememberMe";
import Table from "../assets/Table.jpg";
import PlagiarismIcon from "@mui/icons-material/Plagiarism";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import MergeTypeIcon from "@mui/icons-material/MergeType";
import CompressIcon from "@mui/icons-material/Compress";
import SecurityIcon from "@mui/icons-material/Security";

export default function HomePage() {
  useRememberMe();

  return (
    <div class="flex flex-col h-screen justify-between">
      <NavBar />
      <div className="mb-auto">
        <div className="flex">
          <div className="flex flex-col justify-center mt-[1%] mx-5 md:mx-12 lg:w-1/2">
            <div className="my-5">
              <span className="font-semibold text-5xl">PDF made easy.</span>
              <br /> <br />
              <span className="text-xl">
                All the tools you'll need to get started with PDFs.
              </span>
            </div>
            <div className="flex my-5">
              <div className="mr-5">
                <Button variant="contained" href="/signup">
                  Sign Up
                </Button>
              </div>
              <div>
                <Button className="ml-2" variant="outlined" href="/signup">
                  Login
                </Button>
              </div>
            </div>
            <div className="mt-[2%] mb-4 text-2xl font-semibold">
              Most popular PDF tools
            </div>
            <div className="flex my-2">
              <a href="/read" class="w-full sm:w-1/2 mr-5">
                <div class="p-4 rounded-lg border bg-blue-200">
                  <div class="flex mb-2 items-center justify-start">
                    <PlagiarismIcon />
                    <h3 class="text-base font-medium">Read a PDF File</h3>
                  </div>
                  <p class="text-base">
                    Preview any PDF file by effortlessly uploading the PDF.
                  </p>
                </div>
              </a>
              <a href="/create" class="w-full sm:w-1/2">
                <div class="p-4 rounded-lg   border bg-blue-200">
                  <div class="flex mb-2 items-center justify-start">
                    <NoteAddIcon />
                    <h3 class="text-base font-medium">Create a PDF File</h3>
                  </div>
                  <p class="text-base">
                    Upload images from your device to turn them into a PDF.
                  </p>
                </div>
              </a>
            </div>
            <div className="flex my-2">
              <a href="/merge" class="w-full sm:w-1/2 mr-5">
                <div class="p-4 rounded-lg border bg-blue-200">
                  <div class="flex mb-2 items-center justify-start">
                    <MergeTypeIcon />
                    <h3 class="text-base font-medium">Merge PDF Files</h3>
                  </div>
                  <p class="text-base">
                    Combine multiple PDF files into a single one.
                  </p>
                </div>
              </a>
              <a href="/compress" class="w-full sm:w-1/2">
                <div class="p-4 rounded-lg   border bg-blue-200">
                  <div class="flex mb-2 items-center justify-start">
                    <CompressIcon />
                    <h3 class="text-base font-medium">Compress a PDF File</h3>
                  </div>
                  <p class="text-base">
                    Reduce the size of a PDF file by compresssion.
                  </p>
                </div>
              </a>
            </div>
            <div className="flex my-2">
              <a href="/protect" class="w-full">
                <div class="p-4 rounded-lg border bg-blue-200">
                  <div class="flex mb-2 items-center justify-start">
                    <SecurityIcon />
                    <h3 class="text-base font-medium">Protect a PDF File</h3>
                  </div>
                  <p class="text-base">
                    PDF protection feature that
                    enables users to encrypt their PDF files using a
                    personalized password, ensuring confidential information
                    remains safeguarded.
                  </p>
                </div>
              </a>
            </div>
          </div>
          <div className="w-1/2 h-auto hidden lg:block">
            <img src={Table} alt="side-img" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
