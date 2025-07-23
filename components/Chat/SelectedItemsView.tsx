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
    <div className={clsx(className, "flex items-center")}>
      <span className="shrink-0 whitespace-nowrap">선택한 항목 : </span>
      <div className="flex items-center gap-1 ml-2 flex-wrap">
        {selectItems.map((item, index) =>
          index > VIEWCOUNT - 1 ? null : (
            <Chip
              key={`${item}_${index}`}
              label={item}
              sx={{
                fontSize: "var(--text-chat-sm)",
                backgroundColor: "var(--tag-bg)",
                color: "var(--tag-text)",
                px: 1.25,
                py: 0.5,
                "& .MuiChip-label": {
                  display: "block",
                  whiteSpace: "nowrap",
                },
              }}
            />
          )
        )}
        {selectItems.length > VIEWCOUNT && (
          <Chip
            label={`외 ${selectItems.length - VIEWCOUNT}개`}
            sx={{
              fontSize: "var(--text-chat-sm)",
              backgroundColor: "#7EBAEB",
              color: "var(--tag-text)",
              px: 1.25,
              py: 0.5,
              "& .MuiChip-label": {
                display: "block",
                whiteSpace: "normal",
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default SelectedItemsView;
