import { Link } from "react-router-dom";

interface RelatedLinksSectionProps {
	title: string;
	items: { id: number; name: string }[];
	basePath: string;
	icon?: string;
}

const RelatedLinksSection = ({ title, items, basePath, icon }: RelatedLinksSectionProps) => {
	if (!items || items.length === 0) return null;

	return (
		<div className="details-section">
			<h3>{title}</h3>
			<ul>
				{items.map((item) => (
					<li key={item.id}>
						<Link to={`/${basePath}/${item.id}`}>
							{icon && <span className="link-icon">{icon}</span>} {item.name}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};

export default RelatedLinksSection;
