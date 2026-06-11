function Icon({ name, className = "", size = "text-xl" }) {
    // Ensure name includes 'icon-' prefix if not present, though usage should ideally include it.
    // Based on requirements, we use div with class icon-{name}
    const iconClass = name.startsWith('icon-') ? name : `icon-${name}`;
    return <div className={`${iconClass} ${size} ${className}`}></div>;
}