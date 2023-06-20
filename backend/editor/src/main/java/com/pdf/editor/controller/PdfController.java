package com.pdf.editor.controller;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfSmartCopy;
import com.itextpdf.text.pdf.PdfStamper;
import com.itextpdf.text.pdf.PdfWriter;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Controller;
import org.springframework.util.FileCopyUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayOutputStream;

import java.io.IOException;

@Controller
@RequestMapping("/pdf")
public class PdfController {

	@PostMapping(value = "/compress", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public void compressPdf(@RequestBody MultipartFile file, HttpServletResponse response)
			throws IOException, Exception {
		try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
			PdfReader reader = new PdfReader(file.getInputStream());
			Document document = new Document();
			PdfSmartCopy pdfSmartCopy = new PdfSmartCopy(document, outputStream);
			document.open();

			for (int i = 1; i <= reader.getNumberOfPages(); i++) {
				pdfSmartCopy.addPage(pdfSmartCopy.getImportedPage(reader, i));
			}

			document.close();

			response.setContentType("application/pdf");
			response.setHeader("Content-Disposition", "attachment; filename=compressed.pdf");
			FileCopyUtils.copy(outputStream.toByteArray(), response.getOutputStream());
		}
	}

	@PostMapping("/protect")
	public void protectPDF(
	        @RequestPart("file") MultipartFile file,
	        @RequestPart("password") String password,
	        HttpServletResponse response
	) throws IOException, DocumentException {
	    if (file.isEmpty()) {
	        response.setStatus(HttpStatus.BAD_REQUEST.value());
	        response.getWriter().write("Please provide a PDF file.");
	        return;
	    }

	    PdfReader reader = new PdfReader(file.getInputStream());

	    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

	    PdfStamper stamper = new PdfStamper(reader, outputStream);

	    stamper.setEncryption(password.getBytes(), password.getBytes(), PdfWriter.ALLOW_PRINTING,
	            PdfWriter.ENCRYPTION_AES_128);

	    stamper.close();
	    reader.close();

	    response.setContentType("application/pdf");
	    response.setHeader("Content-Disposition", "attachment; filename=protected.pdf");
	    FileCopyUtils.copy(outputStream.toByteArray(), response.getOutputStream());
	}
}
