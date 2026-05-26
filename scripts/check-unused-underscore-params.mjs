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

function getLineFinding(sourceFile, path, node, message) {
	const { line } = sourceFile.getLineAndCharacterOfPosition(
		node.getStart(sourceFile),
	);

	return `${path}:${line + 1}: ${message}`;
}

function isTypeOnlyCallbackParameter(node) {
	return (
		ts.isFunctionTypeNode(node.parent) || ts.isMethodSignature(node.parent)
	);
}

function findCodacyUnusedParameterRisks(path) {
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
				findings.push(
					getLineFinding(
						sourceFile,
						path,
						node.name,
						`remove leading underscore from parameter '${name}'`,
					),
				);
			}

			if (
				isTypeOnlyCallbackParameter(node) &&
				node.dotDotDotToken === undefined
			) {
				findings.push(
					getLineFinding(
						sourceFile,
						path,
						node.name,
						`use rest tuple syntax instead of named type-only callback parameter '${name}'`,
					),
				);
			}
		}

		ts.forEachChild(node, visit);
	}

	visit(sourceFile);
	return findings;
}

const findings = collectFiles(SOURCE_DIR).flatMap(
	findCodacyUnusedParameterRisks,
);

if (findings.length > 0) {
	console.error(findings.join("\n"));
	process.exit(1);
}
