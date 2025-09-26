import clsx from "clsx";

import { Chip } from "@mui/material";

interface SelectedItemsViewProps {
  className: string;
  selectItems: string[];
}

const VIEWCOUNT = 5;

const SelectedItemsView = ({
  className,
  selectItems,
}: SelectedItemsViewProps) => {
  return (
    <section
      className={clsx(className, "flex items-center")}
      role="region"
      aria-labelledby="selected-items-title"
    >
      <h4 id="selected-items-title" className="shrink-0 whitespace-nowrap">
        선택한 항목 :
      </h4>
      <ul
        className="flex items-center gap-1 ml-2 flex-wrap"
        role="list"
        aria-label="선택된 항목 목록"
      >
        {selectItems.map((item, index) =>
          index > VIEWCOUNT - 1 ? null : (
            <li key={`${item}_${index}`}>
              <Chip
                label={item}
                sx={{
                  backgroundColor: "var(--tag-bg)",
                  color: "var(--tag-text)",
                  px: 0.75,
                  py: 0.5,
                  "& .MuiChip-label": {
                    display: "block",
                    whiteSpace: "nowrap",
                  },
                }}
                aria-label={`선택된 항목: ${item}`}
              />
            </li>
          )
        )}
        {selectItems.length > VIEWCOUNT && (
          <li>
            <Chip
              label={`외 ${selectItems.length - VIEWCOUNT}개`}
              sx={{
                backgroundColor: "#7EBAEB",
                color: "var(--tag-text)",
                px: 0.75,
                py: 0.5,
                "& .MuiChip-label": {
                  display: "block",
                  whiteSpace: "normal",
                },
              }}
              aria-label={`외 ${
                selectItems.length - VIEWCOUNT
              }개 항목이 더 있습니다`}
            />
          </li>
        )}
      </ul>
    </section>
  );
};

export default SelectedItemsView;
