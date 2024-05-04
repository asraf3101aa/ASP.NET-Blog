import { Container, CssBaseline } from "@mui/material";
import Footer from "../components/shared/navigation/Footer";
import Header from "../components/shared/navigation/Header";

const BlogDetails = () => {
  return (
    <Container
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "0px !important",
        maxWidth: "100% !important",
      }}
    >
      <CssBaseline />
      <Header />
      <main>
        <div>Hi</div>
      </main>
      <Footer />
    </Container>
  );
};

export default BlogDetails;
