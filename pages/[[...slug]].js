import { StoryblokComponent, useStoryblokState, getStoryblokApi } from "@storyblok/react";

export default function Page({ story }) {
  story = useStoryblokState(story);
  return (
    <main>
      {story ? <StoryblokComponent blok={story.content} /> : <p>Story not found.</p>}
    </main>
  );
}

export async function getStaticProps({ params }) {
  let slug = params?.slug ? params.slug.join("/") : "home";
  const sbParams = { version: "draft" };

  const storyblokApi = getStoryblokApi();

  try {
    const { data } = await storyblokApi.get(`cdn/stories/${slug}`, sbParams);

    return {
      props: {
        story: data ? data.story : null,
      },
      revalidate: 3600, // ISR: herbouwt elk uur (voorkomt export errors)
    };
  } catch (error) {
    console.error("Error fetching Storyblok story:", error);
    return {
      notFound: true, // voorkomt build-crash op Vercel
    };
  }
}

export async function getStaticPaths() {
  try {
    const storyblokApi = getStoryblokApi();
    const { data } = await storyblokApi.get("cdn/links/");

    const paths = Object.keys(data.links)
      .filter((key) => !data.links[key].is_folder)
      .map((key) => {
        const slug = data.links[key].slug;
        return { params: { slug: slug ? slug.split("/") : [] } };
      });

    return {
      paths,
      fallback: "blocking", // 🔥 belangrijk: laat dynamische rendering toe
    };
  } catch (error) {
    console.error("Error fetching Storyblok links:", error);
    return {
      paths: [],
      fallback: "blocking",
    };
  }
}
