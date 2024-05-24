import css from "./ImageSearch.module.css";
import weaviate from "weaviate-ts-client";

const client = weaviate.client({
  scheme: "https",
  host: "34.87.112.226:8080", // Replace with your Weaviate endpoint
});

const ImageSearch: React.FC = () => {
  return (
    <div>
      <div></div>
    </div>
  );
};

export default ImageSearch;
