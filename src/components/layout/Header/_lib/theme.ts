export function getHeaderTheme(isWhite: boolean) {
  return {
    header: isWhite
      ? "fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 transition-all duration-300"
      : "fixed top-0 left-0 right-0 z-50 bg-transparent transition-all duration-300",
    text: isWhite ? "text-slate-900" : "text-white",
    textHover: isWhite ? "hover:text-teal-600" : "hover:text-teal-400",
    icon: isWhite ? "text-slate-600" : "text-slate-300",
    iconHover: isWhite ? "hover:text-slate-900" : "hover:text-white",
    signInButton: isWhite
      ? "border border-slate-300 bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors"
      : "border border-slate-500 bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-600 transition-colors",
    mobileMenuBg: isWhite ? "bg-white border-b border-slate-200" : "bg-slate-900/95 backdrop-blur-sm",
    mobileLink: isWhite
      ? "text-slate-900 hover:bg-slate-50"
      : "text-white hover:bg-slate-800",
    mobileDivider: isWhite ? "border-slate-200" : "border-slate-700",
    mobileUserBg: isWhite ? "bg-slate-50" : "bg-slate-800",
    mobileUserText: isWhite ? "text-slate-900" : "text-white",
    mobileUserMuted: isWhite ? "text-slate-500" : "text-slate-400",
    mobileSignOut: isWhite ? "text-red-600 hover:bg-red-50" : "text-red-400 hover:bg-slate-800",
    mobileSignIn: isWhite
      ? "bg-teal-600 text-white hover:bg-teal-700"
      : "bg-white text-slate-900 hover:bg-slate-100",
    providerButton: isWhite
      ? "bg-white border border-slate-300 text-slate-900 hover:bg-slate-50"
      : "bg-white/95 backdrop-blur-sm border border-white/30 text-slate-900 hover:bg-white",
    roleBadge: (role: string | undefined) => {
      if (role === "ADMIN") return "bg-purple-100 text-purple-700";
      if (role === "PROVIDER") return "bg-blue-100 text-blue-700";
      return "bg-teal-100 text-teal-700";
    },
  };
}
