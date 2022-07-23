import { getSession } from "next-auth/react";
import type { NextApiRequest } from "next";

const indexPage = () => {
  return <h1>Test home page!</h1>;
};

export const getServerSideProps = async (context: { req: NextApiRequest }) => {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
};

export default indexPage;
