// components/common/PageTitle.jsx

import { useEffect } from "react";

const PageTitle = ({ title }) => {
  useEffect(() => {
    document.title = `KaamSetu | ${title}`;
  }, [title]);

  return null;
};

export default PageTitle;