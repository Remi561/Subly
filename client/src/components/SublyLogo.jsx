
import Logo from '../assets/logo.png'

const SublyLogo = () => {
    return (
      <header className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm">
          <img src={Logo} alt="Subly logo" className="h-8 w-8 object-contain" />
        </div>

        <div>
          <h2 className="text-2xl font-bold tracking-tight text-[#07112B]">
            Subly
          </h2>
          <p className="text-xs font-medium text-slate-500">
            Free subscription tracker
          </p>
        </div>
      </header>
    );
  };
  


export default SublyLogo