const logoFiles = import.meta.glob('../../public/CLIENT logos/*.png', { eager: true });
export const clientLogos = Object.keys(logoFiles)
  .map(key => key.replace('../../public', ''))
  .sort((a, b) => {
    const numA = parseInt(a.match(/logo(\d+)/)?.[1] || 0);
    const numB = parseInt(b.match(/logo(\d+)/)?.[1] || 0);
    return numA - numB;
  });




