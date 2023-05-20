import type { Image } from "@/types/common";

export const isImage = (file: any): file is Image => !!file?.public_id;
