{
  description = "Fred's Personal Website Dev Flake";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";

    precommit-base = {
      url = "github:FredSystems/pre-commit-checks";
      inputs.nixpkgs.follows = "nixpkgs";
    };

    npm-chck.url = "github:FredSystems/npm-chck";
  };

  outputs =
    {
      self,
      precommit-base,
      nixpkgs,
      npm-chck,
    }:
    let
      eachSystem = nixpkgs.lib.genAttrs [
        "aarch64-darwin"
        "aarch64-linux"
        "x86_64-darwin"
        "x86_64-linux"
      ];
    in
    {
      checks = eachSystem (system: {
        pre-commit-check = precommit-base.lib.mkCheck {
          inherit system;

          src = ./.;

          check_javascript = true;
          check_python = false;

          javascript = {
            enableBiome = true;
            enableTsc = true;
            tsConfig = "./tsconfig.json";
          };

          extraExcludes = [
            "secrets.yaml"
          ];
        };
      });

      devShells = eachSystem (
        system:
        let
          pkgs = import nixpkgs {
            inherit system;
          };

          inherit (self.checks.${system}.pre-commit-check) shellHook enabledPackages;
        in
        {
          default = pkgs.mkShell {
            packages = [
              npm-chck.packages.${system}.default
              pkgs.nodejs
            ];

            buildInputs =
              enabledPackages
              ++ (with pkgs; [
                nodejs
                nodePackages.typescript
              ]);

            shellHook = ''
              ${shellHook}
            '';
          };
        }
      );
    };
}
