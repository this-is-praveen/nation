export const getAccountData = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      { id: '1', name: 'Enterprise Account' },
      { id: '2', name: 'Premium Account' },
      { id: '3', name: 'Developer Account' },
    ];
  };
  
  export const getAccountResults = async (id) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    return [
      { name: 'Success Probability', chance: Math.random() },
      { name: 'Growth Potential', chance: Math.random() },
      { name: 'Risk Factor', chance: Math.random() },
    ];
  };