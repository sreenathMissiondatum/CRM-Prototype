
import { searchNaics } from './src/components/Shared/naicsData.js';

console.log("Searching for '721211' (Leaf Code)...");
const results = searchNaics('721211');

const leafNode = results.find(r => r.code === '721211');

if (leafNode) {
    console.log(`Found leaf node: ${leafNode.code} - ${leafNode.title}`);
    console.log(`Type: ${leafNode.type}`);
    console.log(`Is Selectable (type === 'code'): ${leafNode.type === 'code'}`);
} else {
    console.log("Leaf node not found!");
}

console.log("---");
console.log("Searching for '72' (Category)...");
const catResults = searchNaics('72');
const catNode = catResults.find(r => r.code === '72');
if (catNode) {
    console.log(`Found category node: ${catNode.code} - ${catNode.title}`);
    console.log(`Type: ${catNode.type}`);
}
