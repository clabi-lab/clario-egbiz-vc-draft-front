const VersionPage = () => {
  return (
    <div className="h-[100vh] flex flex-1 items-center justify-center flex-col bg-gray-600">
      <h2 className={"text-5xl font-extrabold text-white"}>Project Version</h2>
      <p className={"text-2xl text-white mt-5"}>
        Front Version : {process.env.NEXT_PUBLIC_APP_VERSION}
      </p>
    </div>
  );
};

export default VersionPage;
