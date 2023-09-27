import semanticRelease from "semantic-release";

async function main() {
  try {
    const result = await semanticRelease({
      branches: ["master", "main", "feat/remove-commitlint"],
      ci: false,
      dryRun: true,
      plugins: [
        "@semantic-release/commit-analyzer",
        [
          "@semantic-release/github",
          {
            successComment: false,
            failComment: false,
          },
        ],
        [
          "@semantic-release/exec",
          {
            verifyReleaseCmd: "echo ${nextRelease.version} > .NEXT_VERSION",
          },
        ],
      ],
    });

    if (result) {
      const { lastRelease, commits, nextRelease, releases } = result;

      console.log(
        `Published ${nextRelease.type} release version ${nextRelease.version} containing ${commits.length} commits.`
      );

      if (lastRelease.version) {
        console.log(`The last release was "${lastRelease.version}".`);
      }

      for (const release of releases) {
        console.log(
          `The release was published with plugin "${release.pluginName}".`
        );
      }
    } else {
      console.log("No release published.");
    }
  } catch (err) {
    console.error("The automated release failed with %O", err);
  }
}

main();
