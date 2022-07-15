import { Notify } from "vant";
import "vant/es/notify/style";

import { ElMessage } from "element-plus";
import "element-plus/es/components/message/style/css";

import Clipboard from "clipboard";
import { useBreakpoints, breakpointsTailwind } from "@vueuse/core";

const sm = useBreakpoints(breakpointsTailwind).smaller("sm");
console.log(sm.value);
export const clipboardSuccess = () =>
  sm.value
    ? Notify({
        message: "Copy successfully",
        type: "success",
        duration: 1500,
      })
    : ElMessage({
        message: "Copy successfully",
        type: "success",
        duration: 1500,
      });

export const clipboardError = () =>
  sm.value
    ? Notify({
        message: "Copy failed",
        type: "danger",
      })
    : ElMessage({
        message: "Copy failed",
        type: "error",
      });

export const handleClipboard = (text: string, event: MouseEvent) => {
  const clipboard = new Clipboard(event.target as Element, {
    text: () => text,
  });
  clipboard.on("success", () => {
    clipboardSuccess();
    clipboard.destroy();
  });
  clipboard.on("error", () => {
    clipboardError();
    clipboard.destroy();
  });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (clipboard as any).onClick(event);
};
