import { readdirSync, readFileSync } from "node:fs";
import { extname, join } from "node:path";
import ts from "typescript";

const SOURCE_DIR = "app";
const SOURCE_EXTENSIONS = new Set([".ts", ".tsx"]);

function isSourceFile(path) {
	return SOURCE_EXTENSIONS.has(extname(path));
}

function collectFiles(directory) {
	return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
		const path = join(directory, entry.name);

		if (entry.isDirectory()) return collectFiles(path);
		if (entry.isFile() && isSourceFile(path)) return [path];

		return [];
	});
}

function getSourceKind(path) {
	return path.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
}

function findUnderscoreParameters(path) {
	const sourceFile = ts.createSourceFile(
		path,
		readFileSync(path, "utf8"),
		ts.ScriptTarget.Latest,
		true,
		getSourceKind(path),
	);
	const findings = [];

	function visit(node) {
		if (ts.isParameter(node) && ts.isIdentifier(node.name)) {
			const name = node.name.text;

			if (name !== "_" && name.startsWith("_")) {
				const { line } = sourceFile.getLineAndCharacterOfPosition(
					node.name.getStart(sourceFile),
				);
				findings.push(
					`${path}:${line + 1}: remove leading underscore from parameter '${name}'`,
				);
			}
		}

		ts.forEachChild(node, visit);
	}

	visit(sourceFile);
	return findings;
}

const findings = collectFiles(SOURCE_DIR).flatMap(findUnderscoreParameters);

if (findings.length > 0) {
	console.error(findings.join("\n"));
	process.exit(1);
}
