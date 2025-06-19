import NavBar from "./layout/navBar";

export default function UserLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <NavBar/>
            {children}
        </>
    );
}
