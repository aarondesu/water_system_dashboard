import { QueryStatus } from "@reduxjs/toolkit/query";
import { useAppSelector } from "~/redux/hooks";
import { Progress } from "./ui/progress";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export default function AppLoadingStatus() {
  const [visible, setVisible] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);

  const isUninitialized = useAppSelector((state) => {
    return Object.values(state.api.queries).some((query) => {
      return query && query.status == QueryStatus.uninitialized;
    });
  });

  const isLoading = useAppSelector((state) => {
    return Object.values(state.api.queries).some((query) => {
      return query && query.status == QueryStatus.pending;
    });
  });

  const isSuccess = useAppSelector((state) => {
    return Object.values(state.api.queries).some((query) => {
      return query && query.status == QueryStatus.fulfilled;
    });
  });

  const isRejected = useAppSelector((state) => {
    return Object.values(state.api.queries).some((query) => {
      return query && query.status == QueryStatus.rejected;
    });
  });

  // Show the progress bar
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isSuccess && isLoading) {
      setVisible(true);
      setProgress(0);
      timer = setTimeout(() => setProgress((progress) => 50), 500);
    }

    return () => clearTimeout(timer);
  }, [isLoading]);

  // Hide the progressbar after a few seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (visible && isSuccess && !isLoading) {
      setProgress(100);
      timer = setTimeout(() => {
        setVisible((visible) => false);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [visible, isLoading, isSuccess]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="absolute top-0 min-w-svw max-w-svw z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
          }}
        >
          <Progress value={progress} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
