'use client'
import { motion } from "motion/react";
import { Loader } from "lucide-react";

function UploadProgress({ upProgres }) {
    const percentage = upProgres?.percentage ?? 0;

    return (
        <div className="w-full flex flex-col gap-2">
            {/* Bar tipis di atas */}
            <div className="w-full h-1 bg-foreground/10 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-foreground rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ ease: "easeOut", duration: 0.3 }}
                />
            </div>

            {/* Info */}
            <div className="flex flex-row justify-between items-center px-1">
                <div className="flex flex-row items-center gap-2 text-xs text-foreground/50">
                    <Loader size={12} className="animate-spin shrink-0" />
                    <span>Uploading...</span>
                </div>
                <div className="flex flex-row items-center gap-2 text-xs text-foreground/50">
                    <span>{upProgres?.loaded ?? 0} / {upProgres?.total ?? 0} bytes</span>
                    <span className="font-medium text-foreground/70">{percentage}%</span>
                </div>
            </div>
        </div>
    );
}

export{
    UploadProgress
}