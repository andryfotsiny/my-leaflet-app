import React from 'react';

function Login() {
    return (
        <div>
            <div className="relative" id="home" style={{background:"white", height:"100vh"}}>
                <div aria-hidden="true" className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-20 dark:opacity-40">
                    <div className="blur-[106px] h-56 dark:bg-gradient-to-br dark:from-blue-700 dark:to-purple-400"></div>
                    <div className="blur-[106px] h-32 dark:bg-gradient-to-r dark:from-cyan-400 dark:to-indigo-600"></div>
                </div>

                <div className="relative pt-36 ml-auto">
                    <div className="lg:w-2/3 text-center mx-auto">
                        <h1 className="text-gray-900 dark:text-gray-800 font-bold text-5xl md:text-6xl xl:text-7xl">
                            La cartographie Web des crimes et de l'insécurité à <span className="text-primary dark:text-gray-600">Fianarantsoa.</span>
                        </h1>

                        <p className="mt-8 text-gray-700 dark:text-gray-700 font-bold">
                            Bienvenue sur la cartographie interactive des crimes et de l'insécurité à Fianarantsoa. Cette plateforme vise
                            à fournir des informations précises et à jour sur les incidents criminels dans la région pour
                            améliorer la sécurité et la vigilance des citoyens.
                        </p>
                        <div className="mt-16 flex flex-wrap justify-center gap-y-4 gap-x-6">
                            <a
                                href="http://127.0.0.1:8000/auth/google"
                                className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:bg-primary before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 sm:w-max"
                            >
                                <span className="relative text-base font-semibold text-black">
                                    Connecter avec Google pour accéder à la carte
                                </span>
                            </a>
                            <a
                                href="http://127.0.0.1:8000/auth/google"
                                className="relative flex h-11 w-full items-center justify-center px-6 before:absolute before:inset-0 before:rounded-full before:border before:border-transparent before:bg-primary/10 before:bg-gradient-to-b before:transition before:duration-300 hover:before:scale-105 active:duration-75 active:before:scale-95 dark:before:border-gray-700 dark:before:bg-gray-800 sm:w-max"
                            >
                                <button><span className="relative text-base font-semibold text-primary dark:text-white"><img src="/google.svg" alt="Logo" style={{width:"100px"}} /></span></button>
                            </a>
                        </div>
                        <div className="hidden py-8 mt-16 border-y border-gray-100 dark:border-gray-800 sm:flex justify-between">
                            <div className="text-left">
                                <h6 className="text-lg font-semibold text-gray-700 dark:text-gray-800 font-bold">Carte Interactive</h6>
                                <p className="mt-2 text-gray-800">
                                    Visualisez les incidents criminels sur une carte dynamique.<br />
                                    Filtrez les incidents par type de crime, date et lieu.<br />
                                    Cliquez sur les marqueurs pour obtenir des détails sur chaque incident.
                                </p>
                            </div>
                            <div className="text-left">
                                <h6 className="text-lg font-semibold text-gray-700 dark:text-gray-800 font-bold">Données</h6>
                                <p className="mt-2 text-gray-800">
                                    Tableau des crimes et fonctionnalité de recherche pour trier les données du tableau.
                                </p>
                            </div>
                            <div className="text-left">
                                <h6 className="text-lg font-semibold text-gray-700 dark:text-gray-800 font-bold">Statistiques</h6>
                                <p className="mt-2 text-gray-800">
                                    Accédez à des statistiques détaillées sur les types de crimes les plus fréquents.<br />
                                    Analysez les tendances mensuelles et annuelles.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
