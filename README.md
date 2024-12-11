
# TinyPDF


# Overview

- TinyPDF is a web application inspired by SmallPDF with a touch of with personalization.
- Has the option for reading, creating, merging, compressing, and encrypting PDF files.
- Smaller PDF operations like reading, creating, and merging are performed in the browser.
- Backend processing for larger tasks (compression, encryption) using Java on a Spring Boot server.
- Frontend built with ReactJS, utilizing MaterialUI components and TailwindCSS for styling.
- Fully responsive website, ensuring optimal user experience on any device.
- Stateless Session management by secure login and authentication based on the [Secure Authentication System](https://github.com/SherwinEvan/secure-login).

## Getting Started
To set up the authentication system on your local machine for development and testing, follow these steps:

### Prerequisites
- Node.js and npm (Node Package Manager)
- Spring Tool Suite (or any Java IDE)
- MySQL

### Installation Steps
1. Fork a copy of the repository to your local machine.
2. Open the frontend directory in the terminal and execute the command `npm start` to start the frontend application.
3. Open the backend folder as a project in Spring Tool Suite (or your preferred Java IDE).
4. Modify the MySQL connection settings in the application.properties file to match your local MySQL configuration.
5. Right-click on the backend package and select "Run as Spring Boot App" to start the backend server.

## Code and Resources Used 
**Spring Boot Version:** 3.0.4   
**Dependencies:** iTextPDF, Bouncy Castle, and [Secure Authentication System dependencies](https://github.com/SherwinEvan/secure-login#code-and-resources-used) (Spring Security, Spring Starter JPA, OAuth2 Resource Server, Spring Starter Web, MySQL Connector J, Lombok, H2Database, JSON Web Token).
<br /> 
**ReactJS Version:** 18.0.2  
**Packages:** MaterialUI, TailwindCSS, React-pdf, PDF-LIB, file-saver, Axios, [Secure Authentication System packages](https://github.com/SherwinEvan/secure-login#code-and-resources-used) (Toastify, React Hook Form).

## Backend Implementation
The backend of this web application is based on two Spring Boot servers.   
One of which is to maintain the user authentication, the [Secure Authentication System](https://github.com/SherwinEvan/secure-login). This server defaults to port 8080.   
The other server handles PDF manipulation operations on various end points where the data is taken as a part of MULTI-PART input in the request for processing. This server defaults to port 8081.

## Frontend Implementation
The frontend of the authentication system is developed using ReactJS, a popular JavaScript library for building user interfaces. The frontend is designed with a focus on user experience and incorporates modern UI components and validation techniques.

- **TailwindCSS Styling:** The frontend incorporates TailwindCSS for efficient and customizable styling. TailwindCSS provides a utility-first approach, allowing developers to easily apply pre-defined CSS classes to style elements. This streamlines the styling process and ensures consistency throughout the authentication system.

- **Optimized Performance:** The frontend is optimized for performance, ensuring fast loading times and smooth interactions. Techniques such as lazy loading, are employed to reduce the initial loading time and improve overall user experience.

- **Responsive Design:** The frontend is fully responsive and optimized for various devices, including mobile devices. This ensures a seamless user experience across different screen sizes and platforms.

- **MaterialUI Components:** The frontend utilizes custom styled MaterialUI components to achieve an aesthetically pleasing and intuitive user interface. These components enhance the visual appeal and usability of the authentication system.

- **Form Validation with React Hook Form:** Strict form validation is implemented using the React Hook Form library. This ensures that users provide accurate and valid information during registration, login, and password reset processes.

## Sample Images
![alt-text](https://github.com/SherwinEvan/clone-pdf/blob/b8102bfd029c8dc57586b947422a5bccc4d53ed8/images/home.png)
![alt-text](https://github.com/SherwinEvan/clone-pdf/blob/b8102bfd029c8dc57586b947422a5bccc4d53ed8/images/readpdf.png)
![alt-text](https://github.com/SherwinEvan/clone-pdf/blob/b8102bfd029c8dc57586b947422a5bccc4d53ed8/images/createpdf.png)
![alt-text](https://github.com/SherwinEvan/clone-pdf/blob/b8102bfd029c8dc57586b947422a5bccc4d53ed8/images/mergepdfs.png)
![alt-text](https://github.com/SherwinEvan/clone-pdf/blob/b8102bfd029c8dc57586b947422a5bccc4d53ed8/images/compresspdf.png)
![alt-text](https://github.com/SherwinEvan/clone-pdf/blob/b8102bfd029c8dc57586b947422a5bccc4d53ed8/images/protectpdf.png)
![alt-text](https://github.com/SherwinEvan/clone-pdf/blob/b8102bfd029c8dc57586b947422a5bccc4d53ed8/images/mobilehome.png)
![alt-text](https://github.com/SherwinEvan/clone-pdf/blob/b8102bfd029c8dc57586b947422a5bccc4d53ed8/images/mobilenavbar.png)
![alt-text](https://github.com/SherwinEvan/clone-pdf/blob/b8102bfd029c8dc57586b947422a5bccc4d53ed8/images/mobilecreatepdf.png)


