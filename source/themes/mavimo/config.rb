# Default to development if environment is not set.
saved = environment
if (environment.nil?)
  environment = :development
else
  environment = saved
end

# Location of the theme's resources.
css_dir = "css"
sass_dir = "_sass"
images_dir = "images"
javascripts_dir = "js"
generated_images_dir = images_dir + "/generated"

# Require any additional compass plugins installed on your system.
require 'compass-normalize'
require 'rgbapng'
require 'toolkit'
require 'susy'
require 'sass-globbing'

# You can select your preferred output style here (:expanded, :nested, :compact
# or :compressed).
output_style = :compressed

# To enable relative paths to assets via compass helper functions.
relative_assets = true

# Conditionally enable line comments when in development mode.
line_comments = false

# Output debugging info in development mode.
sass_options = (environment == :production) ? {} : {:debug_info => false}

# Add the 'sass' directory itself as an import path to ease imports.
add_import_path '_sass'
