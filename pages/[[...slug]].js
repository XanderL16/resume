import { StoryblokComponent, useStoryblokState, getStoryblokApi } from "@storyblok/react";

export default function Page({ story }) {
  story = useStoryblokState(story);
  return (
    <main>
      <StoryblokComponent blok={story.content} />
    </main>
  );
}

export async function getStaticProps({ params }) {
  let slug = params.slug ? params.slug.join("/") : "home";
  const sbParams = { version: "draft" };

  const storyblokApi = getStoryblokApi();
  const { data } = await storyblokApi.get(`cdn/stories/${slug}`, sbParams);

  return { props: { story: data ? data.story : false } };
}

export async function getStaticPaths() {
  const storyblokApi = getStoryblokApi();
  const { data } = await storyblokApi.get("cdn/links/");

  const paths = Object.keys(data.links)
    .filter((key) => !data.links[key].is_folder)
    .map((key) => {
      const slug = data.links[key].slug;
      return { params: { slug: slug.split("/") } };
    });

  return { paths, fallback: false };
}
