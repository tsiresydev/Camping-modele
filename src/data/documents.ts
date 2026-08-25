export interface ScoutDocument {
  slug: string;
  title: string;
  description: string;
  file: string;
  type: "PDF";
  size?: string;
}

export const documents: ScoutDocument[] = [
  {
    slug: "pre-camp",
    title: "Autorisation de faire un pré-camp",
    description:
      "Modèle permettant d'obtenir l'accord nécessaire auprès de l'association pour organiser un pré-camp.",
    file: "/modele/FAHAZAHON-DALANA HANAO PRE-CAMP.pdf",
    type: "PDF",
    size: "120 Ko",
  },
  {
    slug: "proprietaire-terrain",
    title: "Autorisation du propriétaire du terrain",
    description:
      "Modèle permettant d'obtenir l'accord écrit du propriétaire du terrain sur lequel le camp sera installé.",
    file: "/modele/FANOMEZAN-DALANA-TOMPON-TOERANA-PRE-CAMPS.pdf",
    type: "PDF",
    size: "115 Ko",
  },
  {
    slug: "camper",
    title: "Autorisation de camper",
    description:
      "Modèle permettant d'obtenir l'autorisation officielle d'organiser et de mener à bien le camp scout.",
    file: "/modele/FAHAZAHON-DALANA HILASY.pdf",
    type: "PDF",
    size: "118 Ko",
  },
];

export function getDocumentBySlug(slug: string): ScoutDocument | undefined {
  return documents.find((doc) => doc.slug === slug);
}
