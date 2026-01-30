import Loader from "@/components/loading";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <Loader />
    </div>
  );
}
