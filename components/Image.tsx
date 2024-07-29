import { Image, ImageProps } from "expo-image";
import { useEffect, useState } from "react";
import * as FileSystem from "expo-file-system";
import { observer } from "@legendapp/state/react";
import { settings } from "@/utils/store";

interface BlurImageProps extends ImageProps {
  uri?: string;
  blurhash?: string;
}

export const BlurImageProps = observer((props: BlurImageProps) => {
  const [exists, setExists] = useState(false);
  const endpoint = settings.get().endpoint;
  const authorization = settings.get().authorization;

  useEffect(() => {
    if (props.uri) {
      FileSystem.getInfoAsync(props.uri).then((info) => {
        if (!info.exists) {
          // download
          if (props.uri && endpoint) {
            const fileName = props.uri.split("/").pop();
            if (fileName) {
              FileSystem.downloadAsync(
                `${endpoint}/images/${fileName}`,
                props.uri,
                {
                  headers: {
                    Authorization: `Basic ${authorization}`,
                  },
                }
              ).then(() => {
                setExists(true);
              });
            }
          }
        } else {
          setExists(true);
        }
      });
    }
  }, [props.uri]);

  return (
    <Image
      {...props}
      source={exists ? { uri: props.uri } : { blurhash: props.blurhash }}
    />
  );
});
