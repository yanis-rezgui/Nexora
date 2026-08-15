import  { memo } from "react"
import Hero from "../Components/HomeComponents/Hero "
import ProductPreview from "../Components/HomeComponents/ProductPreview"
import ProblemSolution from "../Components/HomeComponents/ProblemSolution"
import Features from "../Components/HomeComponents/Features"
import HowItWorks from "../Components/HomeComponents/HowItWorks"
import RealtimeCollaboration from "../Components/HomeComponents/RealtimeCollaboration"
import BuiltForTeams from "../Components/HomeComponents/BuiltForTeams"
import DashboardAnalytics from "../Components/HomeComponents/DashboardAnalytics"
import Pricing from "../Components/HomeComponents/Pricing"
import FAQ from "../Components/HomeComponents/FAQ"
import FinalCTA from "../Components/HomeComponents/FinalCTA"
import Footer from "../Components/HomeComponents/Footer"




const Home = () => {

    return(
        <section>
            <Hero/>
            <ProductPreview/>
            <ProblemSolution/>
            <Features/>
            <HowItWorks/>
            <RealtimeCollaboration/>
            <BuiltForTeams/>
            <DashboardAnalytics/>
            <Pricing/>
            <FAQ/>
            <FinalCTA/>
            <Footer/>
        </section>
    )
}

export default memo(Home)