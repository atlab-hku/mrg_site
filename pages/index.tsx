/* eslint-disable react/display-name */
import React, {useState, useRef} from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import dynamic from "next/dynamic";
import {Photo} from "../lib/types";
import Stack from "@mui/material/Stack";
import {PhotoView} from "../components/PhotoView/PhotoView";
import Filter from "../components/Filter/Filter";

export default function Home({
  locatedPhotos,
  minYear,
  maxYear,
}: {
  locatedPhotos: Photo[];
  minYear: number;
  maxYear: number;
}) {
  const [allPhotos, setAllPhotos] = useState(locatedPhotos);
  const [selectedPhotos, setSelectedPhotos] = useState(locatedPhotos);
  const Map = React.memo(
    dynamic(() => import("../components/Map/Map"), {
      loading: () => <p>Map is loading.</p>,
      ssr: false,
    })
  );

  const [photoViewController, setPhotoViewController] = useState(Object());
  return (
    <div className={styles.container}>
      <Head>
        <title>Mapping Margolies</title>
        <meta
          name="description"
          content="Mapping the images of photographer John Margolies"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1>John Margolies Photo Map</h1>
        <div className="intro">
          <p>
            Photographer John Margolies traveled across America between 1970 and
            2008 taking photographs of roadside attractions. These photographs
            are available in the public domain via the{" "}
            <a href="https://www.loc.gov/free-to-use/john-margolies-roadside-america-photograph-archive/">
              Library of Congress.
            </a>
          </p>
          <p>
            The map below shows the location of each photograph. Adjust the
            slider to filter the photos by year. Select some keywords from the
            dropdown list to show photos with specific words in their title or
            description. Click the Filter button when ready to refresh the map.
          </p>
        </div>

        <Filter
          setSelectedPhotos={setSelectedPhotos}
          allPhotos={allPhotos}
          maxYear={maxYear}
          minYear={minYear}
        ></Filter>
        <Stack spacing={2} direction="row" sx={{mb: 1}} alignItems="center">
          <Map
            photoViewController={photoViewController}
            photos={selectedPhotos}
          />
          <PhotoView photoViewController={photoViewController}></PhotoView>
        </Stack>
      </main>
      <footer className={styles.footer}>
        ©️ 2021 <a href="https://kotsf.com">Kotsf Limited</a> and{" "}
        <a href="https://msteinberg.art">Monica Steinberg</a>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const photos: Photo[] = require("../data/photos.json");
  const locatedPhotos: Photo[] = photos.filter(
    (p: Photo) => p.latitude !== null && p.longitude !== null
  );
  const minYear: number = Math.min(
    ...locatedPhotos.map((p: Photo) => p.min_year)
  );
  const maxYear: number = Math.max(
    ...locatedPhotos.map((p: Photo) => p.max_year)
  );

  return {
    props: {
      locatedPhotos,
      minYear,
      maxYear,
    },
  };
}
