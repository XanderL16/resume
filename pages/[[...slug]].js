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
      props: { story: data ? data.story : null },
      revalidate: 3600, // 🔥 belangrijk: incremental static regeneration
    };
  } catch (error) {
    console.error("Error fetching Storyblok story:", error);
    return { notFound: true };
  }
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking", // 🔥 absoluut cruciaal
  };
}

