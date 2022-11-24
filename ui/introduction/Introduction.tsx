import { useRouter } from "next/router";

const Introduction = () => {
  const router = useRouter();
  return (
    <section className="md:nf-w-4/5 md:nf-mx-auto">
      <div>
        <div className=" nf-px-2 nf-py-4 nf-flex nf-items-center">
          <div className="nf-mr-4">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
            >
              <title>sphere</title>
              <path d="M15 2c-8.284 0-15 6.716-15 15s6.716 15 15 15c8.284 0 15-6.716 15-15s-6.716-15-15-15zM23.487 22c0.268-1.264 0.437-2.606 0.492-4h3.983c-0.104 1.381-0.426 2.722-0.959 4h-3.516zM6.513 12c-0.268 1.264-0.437 2.606-0.492 4h-3.983c0.104-1.381 0.426-2.722 0.959-4h3.516zM21.439 12c0.3 1.28 0.481 2.62 0.54 4h-5.979v-4h5.439zM16 10v-5.854c0.456 0.133 0.908 0.355 1.351 0.668 0.831 0.586 1.625 1.488 2.298 2.609 0.465 0.775 0.867 1.638 1.203 2.578h-4.852zM10.351 7.422c0.673-1.121 1.467-2.023 2.298-2.609 0.443-0.313 0.895-0.535 1.351-0.668v5.854h-4.852c0.336-0.94 0.738-1.803 1.203-2.578zM14 12v4h-5.979c0.059-1.38 0.24-2.72 0.54-4h5.439zM2.997 22c-0.533-1.278-0.854-2.619-0.959-4h3.983c0.055 1.394 0.224 2.736 0.492 4h-3.516zM8.021 18h5.979v4h-5.439c-0.3-1.28-0.481-2.62-0.54-4zM14 24v5.854c-0.456-0.133-0.908-0.355-1.351-0.668-0.831-0.586-1.625-1.488-2.298-2.609-0.465-0.775-0.867-1.638-1.203-2.578h4.852zM19.649 26.578c-0.673 1.121-1.467 2.023-2.298 2.609-0.443 0.312-0.895 0.535-1.351 0.668v-5.854h4.852c-0.336 0.94-0.738 1.802-1.203 2.578zM16 22v-4h5.979c-0.059 1.38-0.24 2.72-0.54 4h-5.439zM23.98 16c-0.055-1.394-0.224-2.736-0.492-4h3.516c0.533 1.278 0.855 2.619 0.959 4h-3.983zM25.958 10h-2.997c-0.582-1.836-1.387-3.447-2.354-4.732 1.329 0.636 2.533 1.488 3.585 2.54 0.671 0.671 1.261 1.404 1.766 2.192zM5.808 7.808c1.052-1.052 2.256-1.904 3.585-2.54-0.967 1.285-1.771 2.896-2.354 4.732h-2.997c0.504-0.788 1.094-1.521 1.766-2.192zM4.042 24h2.997c0.583 1.836 1.387 3.447 2.354 4.732-1.329-0.636-2.533-1.488-3.585-2.54-0.671-0.671-1.261-1.404-1.766-2.192zM24.192 26.192c-1.052 1.052-2.256 1.904-3.585 2.54 0.967-1.285 1.771-2.896 2.354-4.732h2.997c-0.504 0.788-1.094 1.521-1.766 2.192z"></path>
            </svg>
          </div>
          <div>
            <p>
              I am a{" "}
              <span className="nf-font-semibold nf-text-base md:nf-text-lg">
                full-stack developer / software consultant
              </span>{" "}
              based in Dar es salaam.{" "}
            </p>
            <p> I can do remote work for any place in the world.</p>
          </div>
        </div>
        <div className="nf-my-2 nf-ml-14 nf-flex">
          <button className="nf-px-4 nf-py-2 nf-border nf-border-primary nf-text-primary nf-rounded-lg">
            Set up meeting
          </button>
        </div>
      </div>
      <div className="nf-my-6">
        <div className=" nf-px-2 nf-py-4 nf-flex nf-items-center">
          <div className="nf-mr-4">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
            >
              <title>newspaper</title>
              <path d="M28 8v-4h-28v22c0 1.105 0.895 2 2 2h27c1.657 0 3-1.343 3-3v-17h-4zM26 26h-24v-20h24v20zM4 10h20v2h-20zM16 14h8v2h-8zM16 18h8v2h-8zM16 22h6v2h-6zM4 14h10v10h-10z"></path>
            </svg>
          </div>
          <div>
            <p>If you are interested in my latest work and accomplishments.</p>
          </div>
        </div>
        <div className="nf-my-2 nf-ml-14 nf-flex">
          <button
            className="nf-px-4 nf-py-2 nf-border nf-border-primary nf-text-primary nf-rounded-lg"
            onClick={() => router.push("/projects")}
          >
            Check them out
          </button>
        </div>
      </div>
      <div className="nf-my-6">
        <div className=" nf-px-2 nf-py-4 nf-flex nf-items-center">
          <div className="nf-mr-4">
            <svg
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
            >
              <title>node-dot-js</title>
              <path d="M15.997 32c-0.428 0-0.855-0.112-1.229-0.329l-3.915-2.316c-0.584-0.327-0.299-0.443-0.107-0.511 0.78-0.271 0.937-0.333 1.771-0.805 0.087-0.049 0.201-0.031 0.291 0.023l3.008 1.785c0.109 0.060 0.263 0.060 0.363 0l11.727-6.768c0.109-0.063 0.179-0.188 0.179-0.317v-13.533c0-0.132-0.071-0.256-0.183-0.323l-11.721-6.763c-0.108-0.063-0.252-0.063-0.361 0l-11.719 6.764c-0.113 0.065-0.185 0.193-0.185 0.321v13.533c0 0.129 0.072 0.252 0.185 0.313l3.212 1.856c1.743 0.872 2.811-0.155 2.811-1.187v-13.361c0-0.189 0.152-0.337 0.341-0.337h1.487c0.185 0 0.34 0.149 0.34 0.337v13.361c0 2.327-1.267 3.66-3.472 3.66-0.677 0-1.212 0-2.701-0.735l-3.077-1.769c-0.76-0.439-1.229-1.26-1.229-2.139v-13.533c0-0.879 0.471-1.7 1.229-2.137l11.727-6.776c0.743-0.42 1.728-0.42 2.464 0l11.725 6.776c0.76 0.439 1.232 1.259 1.232 2.137v13.533c0 0.879-0.472 1.697-1.232 2.139l-11.725 6.771c-0.373 0.217-0.799 0.329-1.233 0.329zM25.465 18.657c0-2.533-1.712-3.208-5.316-3.684-3.641-0.481-4.012-0.731-4.012-1.583 0-0.704 0.313-1.644 3.011-1.644 2.409 0 3.297 0.519 3.663 2.143 0.032 0.153 0.172 0.265 0.329 0.265h1.521c0.095 0 0.184-0.041 0.248-0.108 0.064-0.072 0.099-0.164 0.089-0.261-0.236-2.797-2.095-4.101-5.851-4.101-3.344 0-5.339 1.411-5.339 3.777 0 2.567 1.984 3.276 5.193 3.593 3.84 0.376 4.137 0.937 4.137 1.692 0 1.311-1.052 1.869-3.523 1.869-3.103 0-3.785-0.779-4.015-2.323-0.027-0.165-0.168-0.287-0.337-0.287h-1.516c-0.188 0-0.339 0.149-0.339 0.337 0 1.976 1.075 4.331 6.207 4.331 3.717 0.001 5.848-1.461 5.848-4.017z"></path>
            </svg>
          </div>
          <div>
            <p>
              I have good experince using Javascript/Typescript languages from
              front-end(with modern tools such as react, nextjs etc)
            </p>
            <p>to backend (with nodejs, expressjs, graphql etc)</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Introduction;
