import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Header from "@/components/shared/navigation/Header.tsx";
import MainFeaturedPost from "@/components/shared/blog/MainFeaturedPost.tsx";
import FeaturedPost from "@/components/shared/blog/FeaturedPost.tsx";
import Footer from "@/components/shared/navigation/Footer.tsx";
import { useRepository } from "@/contexts/RepositoryContext";
import { useEffect, useState } from "react";
import _ from "lodash";
import { Button, Typography } from "@mui/material";

const mainFeaturedPost = {
  title: "Embrace the joy of learning",
  image: "https://source.unsplash.com/random?wallpapers",
  imageText: "main image description",
};

export default function Blog() {
  const {
    isLoading,
    setIsLoading,
    homepageBlogsData,
    setHomepageBlogsData,
    blogRepository,
  } = useRepository()!;

  const [currentPageNumber, setCurrentPageNumber] = useState<number>(
    homepageBlogsData?.paginationMetaData?.pageNumber ?? 1
  );

  useEffect(() => {
    setIsLoading(true);
    blogRepository
      .getHomepageBlogs("recency", currentPageNumber)
      .then((blogsResponse) => {
        if ("errors" in blogsResponse) {
          console.error(blogsResponse);
        } else {
          setHomepageBlogsData(blogsResponse);
          document.documentElement.scrollTo({ top: 0, left: 0 });
        }
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, [blogRepository, currentPageNumber, setHomepageBlogsData, setIsLoading]);

  const handleNextPageChange = () => {
    if (homepageBlogsData?.paginationMetaData?.hasNextPage) {
      setCurrentPageNumber(currentPageNumber + 1);
    }
  };
  const handlePreviousPageChange = () => {
    if (homepageBlogsData?.paginationMetaData?.hasPreviousPage) {
      setCurrentPageNumber(currentPageNumber - 1);
    }
  };

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
      <Container>
        <Header />
        <main>
          <MainFeaturedPost post={mainFeaturedPost} />
          {isLoading ? (
            <Container
              sx={{
                height: "50vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <img src="/assets/icons/Loading.svg" alt="LoadingIcon" />
            </Container>
          ) : homepageBlogsData && homepageBlogsData.blogs.length > 0 ? (
            <Grid container spacing={4}>
              {_.map(homepageBlogsData.blogs, (blog) => (
                <FeaturedPost blog={blog} key={blog.id} />
              ))}
              <Container sx={{ display: "flex", py: 2, gap: 2 }}>
                <Button
                  disabled={
                    !homepageBlogsData?.paginationMetaData?.hasPreviousPage
                  }
                  variant="outlined"
                  sx={{ ml: 1 }}
                  onClick={handlePreviousPageChange}
                >
                  Previous
                </Button>
                <Button
                  disabled={!homepageBlogsData?.paginationMetaData?.hasNextPage}
                  variant="outlined"
                  onClick={handleNextPageChange}
                >
                  Next
                </Button>
              </Container>
            </Grid>
          ) : (
            <Typography variant="h6">No blogs posted yet.</Typography>
          )}
        </main>
      </Container>
      <Footer />
    </Container>
  );
}
