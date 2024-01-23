import { Medal } from "../models/medal";

export function getMedals(): Promise<Medal[]> {
    return Medal.find();
}

export async function updateMedals(): void {
    const result = await fetch("https://osekai.net/medals/api/medals.php");
    const new_medals = await result.json();
    for (const m of new_medals) {
        let medal = await Medal.findOne({ medal_id: m.MedalID });
        if (medal) {
            medal.name = m.Name;
            medal.link = m.Link;
            medal.description = m.Description;
            medal.category = m.Category;
            medal.mode_order = parseInt(m.ModeOrder) || 0;
            medal.order = parseInt(m.Order) || 0;
            medal.rarity = parseInt(m.Rarity) || 0;
        } else {
            medal = new Medal({
                medal_id: m.MedalID,
                name: m.Name,
                link: m.Link,
                description: m.Description,
                category: m.Category,
                mode_order: parseInt(m.ModeOrder) || 0,
                order: parseInt(m.Order) || 0,
                rarity: parseInt(m.Rarity) || 0,
            });
        }
        medal.save();
    }
}
