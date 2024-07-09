import loadingMascot from "/public/loading_mascot.png";

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="text-center">
                <img src={loadingMascot} alt="Loading Mascot" className="mx-auto w-1/2 my-auto" />
                {/* <h1 className="mt-6 text-lg font-semibold text-purple-700">Wait a Moment...</h1> */}
            </div>
        </div>
    );
}