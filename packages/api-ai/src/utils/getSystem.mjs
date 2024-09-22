import systemsIndex from "../systems/systemsIndex.mjs";

export default async function getSystem(systemId, res) {
    const system = systemsIndex.find(system => system.id === systemId);
    if (system) {
      const finalSystem = {
        ...system,
        prompt: await system.prompt()
      }
     
      if (res) {
        res.json(finalSystem);
      }else{
        return finalSystem;
      }
    }else{
      if (res) {
        return res.status(400).json({
          error: 'System not found',
          systemId: systemId
        });
      }else{
        return false;
      }
    }
}